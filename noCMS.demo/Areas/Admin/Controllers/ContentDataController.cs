using System;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web.Mvc;
using noCMS.core;
using noCMS.data.EF;
using noCMS.data.Entities;
using noCMS.demo.Application.Membership;

namespace noCMS.demo.Areas.Admin.Controllers
{
    public class ContentDataController: Controller
    {
        private readonly ApplicationDataContext _context;
        private readonly IApplicationSettings _settings;

        public ContentDataController(ApplicationDataContext context, IApplicationSettings settings)
        {
            _context = context;
            _settings = settings;
        }

        public string Get(string key, bool byCountry)
        {
            if (string.IsNullOrEmpty(key))
            {
                return string.Empty;
            }
            else
            {
                if (byCountry)
                {
                    #region IF SELECT BY COUNTRY
                    
                    string _curCountry = string.Empty;

                    try
                    {
                        _curCountry = CultureInfo.CreateSpecificCulture(Request.RequestContext.RouteData.Values["language"].ToString()).Name;
                    }
                    catch
                    {
                        _curCountry = _settings.DefaultLanguage;
                    }

                    key = key.Insert(0, _curCountry + "/");              

                    #endregion
                }
                else
                {
                    #region IF SELECT BY LANGUAGE

                    key = key.Insert(0, Thread.CurrentThread.CurrentCulture.TwoLetterISOLanguageName + "/");  

                    #endregion
                }

                key = key.ToLower();
                var contentData = _context.ContentElements.FirstOrDefault(el => el.ContentKey == key);

                return contentData != null ? contentData.ContentMarkup : string.Empty;
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        [UrlAuthorize(Roles = "Administrator", AuthUrl = "/Authorization/Authenticate")]
        public JsonResult SaveContent(string key, string data, bool byCountry)
        {
            if (!string.IsNullOrEmpty(key) && !string.IsNullOrEmpty(data))
            {
                if (byCountry)
                {
                    #region IF SELECT BY COUNTRY

                    string _curCountry = string.Empty;

                    try
                    {
                        _curCountry = CultureInfo.CreateSpecificCulture(Request.RequestContext.RouteData.Values["language"].ToString()).Name;
                    }
                    catch
                    {
                        _curCountry = _settings.DefaultLanguage;
                    }

                    key = key.Insert(0, _curCountry + "/");

                    #endregion
                }
                else
                {
                    #region IF SELECT BY LANGUAGE

                    //Enriching "key" with localization data
                    var curCult = Thread.CurrentThread.CurrentCulture.TwoLetterISOLanguageName;

                    if (key[0] != '/') key = key.Insert(0, "/");

                    key = key.Insert(0, curCult);

                    #endregion
                }

                key = key.ToLower();

                var contentData = _context.ContentElements.FirstOrDefault(el => el.ContentKey == key);
                if (contentData != null)
                {
                    contentData.ContentMarkup = data;
                }
                else
                {
                    _context.ContentElements.Add(new Content
                    {
                        ContentKey = key,
                        ContentMarkup = data
                    });
                }

                _context.SaveChanges();

                return Json(new { res = "OK" });
            }

            return Json(new { res = "FAIL", message = "Inconsistent data" });
        }
        public JsonResult GetCountImageInGallery(string id)
        {
            try
            {
                return Json(new { count = Directory.GetFiles(Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~/assets/ObligContent/Galleries/")) + id + "/").Length });
            }
            catch (Exception)
            {
                return Json(new { count = 0 });
            }

        }
        public JsonResult DeleteImage(int imageName, string guid)
        {

            try
            {
                var path = Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~/assets/ObligContent/Galleries/")) + guid + "/";
                System.IO.File.Delete(path + imageName + ".jpg");
                for (int i = (imageName - 1); i < Directory.GetFiles(Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~/assets/ObligContent/Galleries/")) + guid + "/").Length; i++)
                {
                    var originName = i + 1;
                    System.IO.File.Move(path + (i + 2) + ".jpg", path + originName + ".jpg");
                }
                return Json(new { status = "OK" });
            }
            catch
            {
                return Json(new { status = "ERROR" });
            }
        }
        public JsonResult DeleteGallery(string guid)
        {

            try
            {
                var path = Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~/assets/ObligContent/Galleries/")) + guid;
                Directory.Delete(path, true);
                return Json(new { status = "OK" });
            }
            catch
            {
                return Json(new { status = "ERROR" });
            }
        }
    }
}
