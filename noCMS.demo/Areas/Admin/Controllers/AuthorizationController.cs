using System;
using System.Security.Principal;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.Security;
using noCMS.demo.Application.Membership;
using noCMS.demo.Application.MVC;
using noCMS.demo.Areas.Admin.Models;

namespace noCMS.demo.Areas.Admin.Controllers
{
    public class AuthorizationController : RadaCodeBaseController
    {
        private readonly ApplicationSiteUserMembershipProvider _membershipProvider;

        public AuthorizationController(ApplicationSiteUserMembershipProvider membershipProvider)
        {
            _membershipProvider = membershipProvider;
        }

        public ActionResult Authenticate()
        {
            return View();
        }
        public ActionResult AuthenticateAsync(string login, string password)
        {
            var loginModel = new LoginModel
            {
                Name = login,
                Pazz = password
            };

            Login(loginModel, null);
            return Redirect(HttpContext.Request.UrlReferrer.AbsoluteUri);

        }

        [HttpPost]
        public ActionResult Login(LoginModel model, string returnUrl)
        {
            if (ModelState.IsValid)
            {
                if (_membershipProvider.ValidateUser(model.Name, model.Pazz))
                {

                    var user = _membershipProvider.GetUser(model.Name, true) as ApplicationMembershipUser;

                    var serializeModel = new ApplicationIdentityUserDataModel
                        {
                            DisplayName = user.DisplayName, PrimaryRole = user.Roles[0]
                        };

                    var serializer = new JavaScriptSerializer();

                    var userData = serializer.Serialize(serializeModel);

                    var ticket = new FormsAuthenticationTicket(
                                        1,                                     // ticket version
                                        ((ApplicationMembershipUser)user).UserName, // authenticated username
                                        DateTime.Now,                          // issueDate
                                        DateTime.Now.AddMinutes(30),           // expiryDate
                                        false,                                 // true to persist across browser sessions
                                        userData,                              // can be used to store additional user data
                                        FormsAuthentication.FormsCookiePath);  // the path for the cookie

                    IIdentity id = new global::noCMS.demo.Application.Membership.ApplicationIdentity(ticket);
                    IPrincipal principal = new GenericPrincipal(id, new string[] { });

                    Thread.CurrentPrincipal = principal;
                    ControllerContext.HttpContext.User = principal;

                    // Encrypt the ticket using the machine key
                    string encryptedTicket = FormsAuthentication.Encrypt(ticket);

                    // Add the cookie to the request to save it
                    Response.Cookies.Add(new HttpCookie(FormsAuthentication.FormsCookieName, encryptedTicket));
                    //Response.Cookies.Add(new HttpCookie("TicketType", "MPTicket"));

                    if (!String.IsNullOrEmpty(HttpContext.Request.UrlReferrer.AbsoluteUri))
                        returnUrl = HttpContext.Request.UrlReferrer.AbsoluteUri;

                    if (Url.IsLocalUrl(returnUrl) && returnUrl.Length > 1 && returnUrl.StartsWith("/")
                        && !returnUrl.StartsWith("//") && !returnUrl.StartsWith("/\\"))
                    {
                        return new RedirectResult(returnUrl);
                    }
                    else
                    {
                        return RedirectToAction("Index", "Home", new {area = ""});
                    }
                }
                else
                {
                    ModelState.AddModelError("", "Нет, осталось две попытки!.");
                }
            }

            return View("Authenticate", model);
        }

        public ActionResult LogOff()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Index", "Home", new { area = "" });
        }

        public JsonResult WhereToGo()
        {
            var randomUrl = "http://www.google.com";

            return Json(randomUrl, JsonRequestBehavior.AllowGet);
        }

    }
}
