using System.Net;
using System.Web.Mvc;

namespace noCMS.demo.Controllers
{
    public class ErrorController : Controller
    {
        #region Http404

        public ActionResult Http404(string url)
        {
            Response.StatusCode = (int)HttpStatusCode.NotFound;
            Response.SubStatusCode = 404;
            var model = new NotFoundViewModel();
            // If the url is relative ('NotFound' route) then replace with Requested path
            model.RequestedUrl = Request.Url.OriginalString.Contains(url) & Request.Url.OriginalString != url ?
            Request.Url.OriginalString : url;
            // Dont get the user stuck in a 'retry loop' by
            // allowing the Referrer to be the same as the Request
            model.ReferrerUrl = Request.UrlReferrer != null &&
            Request.UrlReferrer.OriginalString != model.RequestedUrl ?
            Request.UrlReferrer.OriginalString : null;

            // TODO: insert ILogger here
            //Elmah.ErrorSignal.FromCurrentContext().Raise(new Exception("Http404 - error controller"));

            return View("NotFound", "_Layout", model);
        }
        public class NotFoundViewModel
        {
            public string RequestedUrl { get; set; }
            public string ReferrerUrl { get; set; }
        }

        #endregion
    }
}
