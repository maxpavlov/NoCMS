using System.Web.Mvc;
using LowercaseRoutesMVC4;
using noCMS.core;

namespace noCMS.demo.Areas.Admin
{
    public class AdminAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "admin";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRouteLowercase(
                "Admin_default",
                "admin/{controller}/{action}/{id}",
                new { controller = "ApplicationManagement", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
