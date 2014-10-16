using System.Globalization;
using System.IO;
using System.Threading;
using System.Web.Mvc;
using noCMS.core;

namespace noCMS.demo.Application.MVC
{
    public class RadaCodeViewEngine: RazorViewEngine
    {
        private static IApplicationSettings _settings;

        public RadaCodeViewEngine(IApplicationSettings settings)
        {
            _settings = settings;
        }

        protected override IView CreatePartialView(ControllerContext controllerContext, string partialPath)
        {
            partialPath = LocalizeViewPath(controllerContext, partialPath);
            return new RazorView(controllerContext, partialPath,
            layoutPath: null, runViewStartPages: false, viewStartFileExtensions: FileExtensions, viewPageActivator: ViewPageActivator);
        }

        protected override IView CreateView(ControllerContext controllerContext, string viewPath, string masterPath)
        {
            viewPath = LocalizeViewPath(controllerContext, viewPath);
            return base.CreateView(controllerContext, viewPath, masterPath);
        }

        private static string LocalizeViewPath(ControllerContext controllerContext, string viewPath)
        {
            var controllerName = (string)controllerContext.RouteData.Values["controller"];

            var viewNameWithExt = viewPath.Substring(viewPath.LastIndexOf("/", System.StringComparison.Ordinal) + 1);

            var viewName = viewNameWithExt.Substring(0, viewNameWithExt.Length - 7);

            var request = controllerContext.HttpContext.Request;

            try
            {
                if (request.QueryString["lang"] != null) //THIS IF IS LEFT HERE FOR REVERSE COMPATABILITY WITH MISECHKO SITE ONLY. SHOULD NOT GO INTO RADACODE.MVCx
                {
                    Thread.CurrentThread.CurrentCulture =
                        Thread.CurrentThread.CurrentUICulture =
                        new CultureInfo(request.QueryString["lang"]);
                }
            }
            catch
            {
                
            }

            var localizedViewPath = string.Format("~/Views/{0}/{1}.{2}.cshtml", controllerName, viewName, Thread.CurrentThread.CurrentCulture.TwoLetterISOLanguageName);
            
            if (ShouldConsiderArea(controllerContext))
            {
                var area = string.Format("Areas/{0}/", controllerContext.RouteData.DataTokens["area"]);

                localizedViewPath = localizedViewPath.Insert("~/".Length, area);

                if (File.Exists(request.MapPath(localizedViewPath)))
                    return localizedViewPath;

                localizedViewPath = string.Format("~/Views/Shared/{0}.{1}.cshtml", viewName, Thread.CurrentThread.CurrentCulture.TwoLetterISOLanguageName);

                localizedViewPath = localizedViewPath.Insert("~/".Length, area);

                if (File.Exists(request.MapPath(localizedViewPath)))
                    return localizedViewPath;
            }
            else
            {
                if (File.Exists(request.MapPath(localizedViewPath)))
                    return localizedViewPath;

                localizedViewPath = string.Format("~/Views/Shared/{0}.{1}.cshtml", viewName, Thread.CurrentThread.CurrentCulture.TwoLetterISOLanguageName);

                if (File.Exists(request.MapPath(localizedViewPath)))
                    return localizedViewPath;
            }

            return viewPath;
        }

        private static bool ShouldConsiderArea(ControllerContext controllerContext)
        {
            return controllerContext.RouteData.DataTokens.ContainsKey("area");
        }
    }
}