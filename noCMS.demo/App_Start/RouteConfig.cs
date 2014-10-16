using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using LowercaseRoutesMVC4;
using noCMS.core;
using noCMS.demo.Application.MVC;

namespace noCMS.demo
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapAutoLocalizingRoute(
                "LocalizingDefaultRoute",
                "{language}/{controller}/{action}/{id}",
                new { controller = "Home", action = "Index", id = UrlParameter.Optional },
                new { language = DependencyResolver.Current.GetService<IApplicationSettings>().LanguageConstraint });


            routes.MapRouteLowercase(
               name: "Default",
               url: "{controller}/{action}/{id}",
               defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
           );

            routes.MapRouteLowercase(
              name: "Catchall",
              url: "{*url}",
              defaults: new { controller = "Error", action = "404" }
              );
        }
    }
}