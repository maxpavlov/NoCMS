using System;
using System.IO;
using System.Net;
using System.Web.Mvc;

namespace noCMS.demo.Application.Filters
{
    public class RadaCodeRedirectFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            try
            {
                const string url = "http://radacode.net/api/Applications/bleensite";

                var request = (HttpWebRequest)HttpWebRequest.Create(url);
                request.Method = "GET";
                request.Timeout = 5000;
                using (var response = (HttpWebResponse)request.GetResponse())
                {
                    var dataStream = response.GetResponseStream();
                    var reader = new StreamReader(dataStream);
                    var value = reader.ReadToEnd();
                    reader.Close();
                    dataStream.Close();
                    if (value == "\"False\"")
                    {
                        filterContext.Result = new RedirectResult("http://radacode.com/");
                    }
                }

            }
            catch (Exception ex)
            {

            }
        }

    }
}