using System.Web.Mvc;
using noCMS.core;

namespace noCMS.demo.Application.Membership
{
    public class UrlAuthorizeAttribute : System.Web.Mvc.AuthorizeAttribute
    {
        public string AuthUrl { get; set; }

        protected override void HandleUnauthorizedRequest(System.Web.Mvc.AuthorizationContext filterContext)
        {
            var settings = DependencyResolver.Current.GetService<IApplicationSettings>();
            
            filterContext.Result = new System.Web.Mvc.RedirectResult("~/" + settings.AdminUrlRoot + AuthUrl, false);
        }
    }
}