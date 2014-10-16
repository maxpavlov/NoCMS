using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;
using noCMS.core;
using noCMS.data.EF;
using noCMS.demo.Application.MVC;
using noCMS.demo.Models;

namespace noCMS.demo.Controllers
{
    public class HomeController : RadaCodeBaseController
    {
        readonly ApplicationDataContext _context;
        private readonly IApplicationSettings _settings;

        public HomeController(ApplicationDataContext db, IApplicationSettings settings)
        {
            _context = db;
            _settings = settings;
        }

        public ActionResult Index()
        {
            var model = new AboutPageModel();

            var defCulture = CultureInfo.GetCultureInfoByIetfLanguageTag(_settings.DefaultLanguage);

            if (!User.IsInRole("Administrator"))
            {
                var content = _context.ContentElements.FirstOrDefault(x => x.ContentKey == defCulture.TwoLetterISOLanguageName + "/about-page");
                if (content != null)
                {
                    model.AboutMarkup = content.ContentMarkup;
                }

            }


            model.PersonItems = _settings.MultiLanguage ? _context.PersonItems.Where(i => i.Culture == _curCult).ToList() : _context.PersonItems.Where(i => i.Culture == defCulture.TwoLetterISOLanguageName).ToList();

            return View("Index", model);
        }
    }
}
