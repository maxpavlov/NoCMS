using System;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using noCMS.core;

namespace noCMS.demo.Application.Filters
{
    public class DomainRedirect : ActionFilterAttribute
    {
        private readonly IApplicationSettings _settings;

        public DomainRedirect(IApplicationSettings settings)
        {
            _settings = settings;
        }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (_settings.MultiLanguage)
            {


                var curUri = filterContext.RequestContext.HttpContext.Request.Url;

                string langSetting = null;

                try
                {
                    langSetting = (string) filterContext.RouteData.Values["language"];
                }
                catch (Exception)
                {
                }

                var currentLang = !string.IsNullOrEmpty(langSetting)
                    ? langSetting
                    : Thread.CurrentThread.CurrentCulture.Name;

                var noRedirectCookie =
                    filterContext.RequestContext.HttpContext.Request.Cookies[_settings.NoRedirectCookieName];

                #region Clean query string from no redirect parameter

                var queryString = HttpUtility.ParseQueryString(curUri.Query);

                var isNoRedirect = queryString.GetValues(null) != null &&
                                   queryString.GetValues(null).Contains(_settings.NoRedirectQueryStringParamName);
                if (isNoRedirect)
                {
                    queryString.Remove(null);

                    string pagePathWithoutQueryString = curUri.GetLeftPart(UriPartial.Path);

                    var cleanRedirectUrl = queryString.Count > 0
                        ? String.Format("{0}?{1}", pagePathWithoutQueryString, queryString)
                        : pagePathWithoutQueryString;

                    filterContext.HttpContext.Response.Cookies.Add(new HttpCookie(_settings.NoRedirectCookieName));

                    filterContext.HttpContext.Response.Redirect(
                        cleanRedirectUrl,
                        true);

                }

                #endregion

                #region Redirect via RedirectMap

                if (noRedirectCookie == null && _settings.ForceCultureDomainRedirect)
                {
                    if (
                        _settings.RedirectMap.Any(
                            entry =>
                                String.Equals(entry.Key, Thread.CurrentThread.CurrentCulture.Name,
                                    StringComparison.CurrentCultureIgnoreCase)))
                    {
                        filterContext.Result =
                            new RedirectResult(
                                _settings.RedirectMap.First(
                                    entry => entry.Key == Thread.CurrentThread.CurrentCulture.Name)
                                    .Value.ToLower());
                        return;
                    }
                }

                #endregion

                var secondSection = string.Empty;
                if (curUri.Segments.Length > 1)
                    secondSection = curUri.Segments[1].Substring(0, curUri.Segments[1].Length);

                int lastSlash = secondSection.LastIndexOf('/');
                secondSection = (lastSlash > -1) ? secondSection.Substring(0, lastSlash) : secondSection;

                if (String.IsNullOrEmpty(secondSection)
                    ||
                    _settings.ImplementedLanguages.All(
                        lang => !String.Equals(lang.Key, secondSection, StringComparison.CurrentCultureIgnoreCase))
                    && !String.Equals(secondSection, _settings.AdminUrlRoot, StringComparison.CurrentCultureIgnoreCase))
                {
                    if (String.IsNullOrEmpty(secondSection))
                        filterContext.Result = new RedirectResult("/" + currentLang.ToLower() + "/");
                    else
                        filterContext.Result =
                            new RedirectResult("/" + currentLang.ToLower() + "/" + secondSection + "/");

                    return;
                }

                if (_settings.LocalLanguageDomainMap.Any(
                    ent => String.Equals(ent.Key, currentLang, StringComparison.CurrentCultureIgnoreCase)))
                {
                    var localMapEntry =
                        _settings.LocalLanguageDomainMap.Single(
                            ent => String.Equals(ent.Key, currentLang, StringComparison.CurrentCultureIgnoreCase));

                    if (filterContext.RequestContext.HttpContext.Request.Url != null &&
                        !String.Equals(filterContext.RequestContext.HttpContext.Request.Url.Host + "/",
                            localMapEntry.Value.Substring(
                                localMapEntry.Value.IndexOf("//", System.StringComparison.Ordinal) + 2),
                            StringComparison.CurrentCultureIgnoreCase) &&
                        !String.Equals(secondSection, _settings.AdminUrlRoot, StringComparison.CurrentCultureIgnoreCase) &&
                        noRedirectCookie == null)

                        if (filterContext.HttpContext.Request.Url.ToString().Contains("doNCR"))
                            filterContext.Result =
                                new RedirectResult(
                                    localMapEntry.Value + langSetting + "/?" +
                                    _settings.NoRedirectQueryStringParamName);
                        else
                        {
                            if (langSetting != null)
                            {
                                filterContext.Result =
                                    new RedirectResult(
                                        localMapEntry.Value + langSetting + "/");
                            }
                            else
                            {
                                filterContext.Result =
                                    new RedirectResult(
                                        localMapEntry.Value);
                            }
                        }
                    if (filterContext.HttpContext.Request.Url.ToString().Contains("doNCR"))
                    {
                        queryString = HttpUtility.ParseQueryString(curUri.Query);
                        queryString.Remove(null);

                        string pagePathWithoutQueryString = curUri.GetLeftPart(UriPartial.Path);

                        var cleanRedirectUrl = queryString.Count > 0
                            ? String.Format("{0}?{1}", pagePathWithoutQueryString, queryString)
                            : pagePathWithoutQueryString;

                        filterContext.HttpContext.Response.Redirect(
                            cleanRedirectUrl,
                            true);
                    }

                }

                if (filterContext.HttpContext.Request.Url.ToString().Contains("doNCR"))
                {
                    queryString = HttpUtility.ParseQueryString(curUri.Query);
                    queryString.Remove(null);

                    string pagePathWithoutQueryString = curUri.GetLeftPart(UriPartial.Path);

                    var cleanRedirectUrl = queryString.Count > 0
                        ? String.Format("{0}?{1}", pagePathWithoutQueryString, queryString)
                        : pagePathWithoutQueryString;

                    filterContext.HttpContext.Response.Redirect(
                        cleanRedirectUrl,
                        true);
                }

            }
        }

    }
}