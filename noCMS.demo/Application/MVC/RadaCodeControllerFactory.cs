using System;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using noCMS.core;

namespace noCMS.demo.Application.MVC
{
    public class RadaCodeControllerFactory: DefaultControllerFactory
    {
        private readonly IApplicationSettings _settings;

        public RadaCodeControllerFactory(IApplicationSettings settings)
        {
            _settings = settings;
        }

        protected override IController GetControllerInstance(RequestContext requestContext, Type controllerType)
        {
            try
            {
                string UILanguage = string.Empty;

                var isNoRedirectCookie = requestContext.HttpContext.Request.Cookies[_settings.NoRedirectCookieName] != null;

                //Setting UILanguage journey 
                if (isNoRedirectCookie && _settings.MultiLanguage)
                {
                    if ( //Present in local site domin list, get the corresponsing culture this domain is linked to.
                        _settings.LocalLanguageDomainMap.Any(
                            entry => new Uri(entry.Value).Host == requestContext.HttpContext.Request.Url.Host))
                    {
                        var particularEntry = _settings.LocalLanguageDomainMap.First(
                            entry => new Uri(entry.Value).Host == requestContext.HttpContext.Request.Url.Host);
                        UILanguage = particularEntry.Key;
                    }
                } 
                else if (requestContext.RouteData.Values["language"] == null && _settings.MultiLanguage)
                {
                    UILanguage = _settings.ImplementedLanguages.Any(
                        lang => lang.Key == Thread.CurrentThread.CurrentCulture.Name)
                        ? Thread.CurrentThread.CurrentCulture.Name
                        : _settings.DefaultLanguage;
                }
                else
                {
                    if (_settings.MultiLanguage)
                        UILanguage = requestContext.RouteData.Values["language"].ToString();
                    else
                        UILanguage = _settings.DefaultLanguage;
                }

                CultureInfo culture = CultureInfo.CreateSpecificCulture(UILanguage);
                Thread.CurrentThread.CurrentCulture = culture;
                Thread.CurrentThread.CurrentUICulture = culture;

                if (controllerType == null)
                    return base.GetControllerInstance(requestContext, controllerType);
            }

            catch (HttpException ex)
            {
                if (ex.GetHttpCode() == 404)
                {
                    IController errorController = DependencyResolver.Current.GetService<ErrorController>();
                    ((ErrorController)errorController).InvokeHttp404(requestContext.HttpContext);

                    return errorController;
                }
                else
                    throw ex;
            }

            return DependencyResolver.Current.GetService(controllerType) as Controller;
        }

        public void CleanQueryStringNoRedirectParameterViaRedirect() { }
    }
}