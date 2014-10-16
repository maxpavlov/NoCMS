using System;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;
using noCMS.core;
using noCMS.data.EF;
using noCMS.data.Entities;
using noCMS.demo.Application.Membership;
using noCMS.demo.Application.MVC;

namespace noCMS.demo.Areas.Admin.Controllers
{
    [UrlAuthorize(Roles = "Administrator", AuthUrl = "/Authorization/Authenticate")]
    public class PersonAdminController : RadaCodeBaseController
    {
        readonly ApplicationDataContext _context;
        private readonly IApplicationSettings _settings;
        private CultureInfo _defCulture;

        public PersonAdminController(ApplicationDataContext db, IApplicationSettings settings)
        {
            _context = db;
            _settings = settings;

            _defCulture = CultureInfo.GetCultureInfoByIetfLanguageTag(_settings.DefaultLanguage);
        }

        [HttpPost]
        public JsonResult AddPersonItem()
        {
            var model = new PersonItem
            {
                FullName = "Full Name",
                Position = "Position",
                Description = "Description",
                Culture = _defCulture.TwoLetterISOLanguageName,
                Version = 1
                //Culture = _curCult
            };

            _context.PersonItems.Add(model);
            _context.SaveChanges();

            return Json(new { status = "OK", data = model });
        }

        [HttpPost]
        public JsonResult UpdatePersonItem(string id, string position, string description, string fullName)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrEmpty(fullName) || string.IsNullOrEmpty(position) || string.IsNullOrEmpty(description)) return Json(new { status = "ERROR" });

            var guid = Guid.Parse(id);
            var item = _context.PersonItems.FirstOrDefault(i => i.Id == guid);

            if (item == null) return Json(new { status = "ERROR" });

            item.Description = description;
            item.Position = position;
            item.FullName = fullName;

            _context.SaveChanges();

            return Json(new { status = "OK" });
        }

        [HttpPost]
        public JsonResult RemoveItem(string id)
        {
            if (string.IsNullOrEmpty(id)) return Json(new { status = "ERROR" });

            var guid = Guid.Parse(id);
            var item = _context.PersonItems.FirstOrDefault(i => i.Id == guid);

            if (item == null) return Json(new { status = "ERROR" });

            try
            {
                System.IO.File.Delete(CustomContentFolder + item.Id + ".png");
            }
            catch (Exception)
            { }

            _context.PersonItems.Remove(item);
            _context.SaveChanges();

            return Json(new { status = "OK" });
        }

        [HttpPost]
        public JsonResult UpdateItemVersion(string id)
        {
            if (string.IsNullOrEmpty(id)) return Json(new { status = "ERROR", data = "id cannot be empty" });

            var guid = Guid.Parse(id);

            var item = _context.PersonItems.FirstOrDefault(x => x.Id == guid);

            if (item != null)
            {
                item.Version++;
                _context.SaveChanges();
            }

            return Json(new { status = "OK", version = item.Version });
        }
    }
}