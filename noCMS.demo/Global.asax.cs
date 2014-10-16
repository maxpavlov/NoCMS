using System;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using noCMS.core;
using noCMS.demo.Application.Filters;
using noCMS.demo.Application.MVC;

namespace noCMS.demo
{

    public class MvcApplication : HttpApplication
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new DomainRedirect(DependencyResolver.Current.GetService<IApplicationSettings>()));
        }
        protected void Application_Start()
        {
            RegisterGlobalFilters(GlobalFilters.Filters);
            AutoMapperRegistar.RegistarMapping();

            ViewEngines.Engines.Clear();
            ViewEngines.Engines.Add(new RadaCodeViewEngine(DependencyResolver.Current.GetService<IApplicationSettings>()));
            ControllerBuilder.Current.SetControllerFactory(new RadaCodeControllerFactory(DependencyResolver.Current.GetService<IApplicationSettings>()));

            AreaRegistration.RegisterAllAreas();

            //WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            MvcHandler.DisableMvcResponseHeader = true;
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            Exception exception = Server.GetLastError();
            //Elmah.ErrorSignal.FromCurrentContext().Raise(exception);
        }
    }
}