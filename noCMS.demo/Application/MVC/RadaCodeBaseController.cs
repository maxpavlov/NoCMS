using System.IO;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace noCMS.demo.Application.MVC
{
    public abstract class RadaCodeBaseController : Controller
    {
        public string CustomContentFolder
        {
            get { return Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~/assets/ObligContent/")); }
        }

        protected string _curCult;

        protected override void OnResultExecuting(ResultExecutingContext filterContext)
        {
            base.OnResultExecuting(filterContext);
        }

        protected string ActionerIP
        {
            get
            {
                var ip = HttpContext.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
                if (string.IsNullOrEmpty(ip)) ip = HttpContext.Request.UserHostAddress;

                return ip;
            }
        } 

        protected string ActionerID
        {
            get
            {
                if (!User.Identity.IsAuthenticated) return string.Empty;
                return User.Identity.Name;
            }
        }

        protected string GetControllerActionUrl(string actionName, string controllerName)
        {
            if (HttpContext == null)
                return string.Empty;
            else
            {
                var virtualPathData = RouteTable.Routes.GetVirtualPath(
                    new RequestContext(HttpContext, RouteTable.Routes.GetRouteData(httpContext: HttpContext)),
                    new RouteValueDictionary(new {controller = controllerName, action = actionName}));
                if (virtualPathData != null)
                    return virtualPathData.VirtualPath;
                else
                {
                    return string.Empty;
                }
            }
        }

        protected override void OnActionExecuting(ActionExecutingContext ctx)
        {
            base.OnActionExecuting(ctx);

            _curCult = Thread.CurrentThread.CurrentCulture.TwoLetterISOLanguageName;
        }

        protected string RenderRazorViewToString(string viewName, object model)
        {
            ViewData.Model = model;
            using (var sw = new StringWriter())
            {
                var viewResult = ViewEngines.Engines.FindPartialView(ControllerContext, viewName);
                var viewContext = new ViewContext(ControllerContext, viewResult.View, ViewData, TempData, sw);
                viewResult.View.Render(viewContext, sw);
                viewResult.ViewEngine.ReleaseView(ControllerContext, viewResult.View);
                return sw.GetStringBuilder().ToString();
            }
        }

        #region Http404 handling

        protected override void HandleUnknownAction(string actionName)
        {
            // If controller is ErrorController dont 'nest' exceptions
            if (this.GetType() != typeof(ErrorController))
                this.InvokeHttp404(HttpContext);
        }

        public ActionResult InvokeHttp404(HttpContextBase httpContext)
        {
            IController errorController = DependencyResolver.Current.GetService<ErrorController>();
            var errorRoute = new RouteData();
            errorRoute.Values.Add("controller", "Error");
            errorRoute.Values.Add("action", "Http404");
            errorRoute.Values.Add("url", httpContext.Request.Url.OriginalString);
            errorController.Execute(new RequestContext(
                 httpContext, errorRoute));

            return new EmptyResult();
        }

        #endregion
    }
}