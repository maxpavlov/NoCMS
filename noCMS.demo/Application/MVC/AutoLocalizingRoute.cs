using System;
using System.Threading;
using System.Web.Mvc;
using System.Web.Routing;
using Ninject;
using noCMS.core;

namespace noCMS.demo.Application.MVC
{
    public class AutoLocalizingRoute : Route
    {
        public AutoLocalizingRoute(string url, object defaults, object constraints)
            : base(url, new RouteValueDictionary(defaults), new RouteValueDictionary(constraints), new MvcRouteHandler()) { }

        public AutoLocalizingRoute(string url, IRouteHandler routeHandler)
        : base(url, routeHandler) {}

        public AutoLocalizingRoute(string url, RouteValueDictionary defaults, IRouteHandler routeHandler)
            : base(url, defaults, routeHandler) {}

        public AutoLocalizingRoute(string url, RouteValueDictionary defaults, RouteValueDictionary constraints,
                              IRouteHandler routeHandler)
            : base(url, defaults, constraints, routeHandler) {}

        public AutoLocalizingRoute(string url, RouteValueDictionary defaults, RouteValueDictionary constraints,
                              RouteValueDictionary dataTokens, IRouteHandler routeHandler)
            : base(url, defaults, constraints, dataTokens, routeHandler) {}

        public override VirtualPathData GetVirtualPath(RequestContext requestContext, RouteValueDictionary values)
        {
            // only set the culture if it's not present in the values dictionary yet
            // this check ensures that we can link to a specific language when we need to (fe: when picking your language)
            if (!values.ContainsKey("language"))
            {
                values["language"] = Thread.CurrentThread.CurrentCulture.Name;
            }

            var path = base.GetVirtualPath(requestContext, values);
            if (path != null)
            {
                path.VirtualPath = path.VirtualPath.ToLowerInvariant();
                if (path.VirtualPath.Substring(path.VirtualPath.LastIndexOf('/') + 1) == "index")
                    path.VirtualPath = path.VirtualPath.Substring(0, path.VirtualPath.LastIndexOf('/') + 1);

                if (path.VirtualPath.EndsWith("//"))
                    path.VirtualPath = path.VirtualPath.Substring(0, path.VirtualPath.Length - 1);

                if (path.VirtualPath.Substring(path.VirtualPath.LastIndexOf('/') + 1) == "home")
                    path.VirtualPath = path.VirtualPath.Substring(0, path.VirtualPath.LastIndexOf('/') + 1);

                if (path.VirtualPath.EndsWith("//"))
                    path.VirtualPath = path.VirtualPath.Substring(0, path.VirtualPath.Length - 1);

                if (!path.VirtualPath.EndsWith("/"))
                    path.VirtualPath += "/";

            }

            return path;
        }
    }

    public static class RouteCollectionExtensions
    {
        public static void MapAutoLocalizingRoute(this RouteCollection routes, string name, string url, object defaults)
        {
            if (DependencyResolver.Current.GetService<IApplicationSettings>().MultiLanguage)
                routes.MapAutoLocalizingRoute(name, url, defaults, null);
            else
                routes.MapRoute(name, url, defaults, null);
        }

        public static void MapAutoLocalizingRoute(this RouteCollection routes, string name, string url, object defaults,
                                             object constraints)
        {
            if (routes == null)
                throw new ArgumentNullException("routes");

            if (url == null)
                throw new ArgumentNullException("url");

            Route route;

            if (DependencyResolver.Current.GetService<IApplicationSettings>().MultiLanguage)
            {
                route = new AutoLocalizingRoute(url, new MvcRouteHandler())
                {
                    Defaults = new RouteValueDictionary(defaults),
                    Constraints = new RouteValueDictionary(constraints)
                };
            }
            else
            {
                route = new Route(url, new MvcRouteHandler())
                {
                    Defaults = new RouteValueDictionary(defaults),
                    Constraints = new RouteValueDictionary(constraints)
                };
            }

            if (String.IsNullOrEmpty(name))
                routes.Add(route);
            else
                routes.Add(name, route);
        }
    }
}