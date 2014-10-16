using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Data.SqlTypes;
using System.Linq;
using noCMS.data.EF;
using noCMS.data.Entities;
using noCMS.data.Utils;

namespace noCMS.data.Migrations
{
    internal sealed class Configuration : DbMigrationsConfiguration<ApplicationDataContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = false;
        }

        protected override void Seed(ApplicationDataContext context)
        {
            var roles = new List<SiteUserRole>
                {
                    new SiteUserRole
                        {
                            Id = Guid.Parse("9727d3e4-0269-46e1-ad7c-bfbdc9c074bc"),
                            AdminFeaturesAvailable = true,
                            Description = "Администратор сайту Поляну",
                            RoleName = "Administrator"
                        }
                };

            foreach (var userRole in roles.Where(role => !context.UserRoles.Any(rl => rl.RoleName == role.RoleName)))
            {
                context.UserRoles.Add(userRole);
            }

            var adminUser = new SiteUser()
            {
                Id = Guid.Parse("479460f6-06c1-43fb-96c3-6ff161255c04"),
                CreateDate = DateTime.Now,
                UserName = "admin",
                Password = Crypto.HashPassword("test"),
                UserRoles = context.UserRoles.Local.Where(rl => rl.RoleName == "Administrator").ToList(),
                IsLockedOut = false,
                LastActivityDate = SqlDateTime.MinValue.Value,
                LastLoginDate = SqlDateTime.MinValue.Value,
                LastLockoutDate = SqlDateTime.MinValue.Value,
                LastPasswordChangedDate = SqlDateTime.MinValue.Value,
                LastPasswordFailureDate = SqlDateTime.MinValue.Value,
                PasswordVerificationTokenExpirationDate = SqlDateTime.MinValue.Value
            };


            if (!context.SiteUsers.Any(usr => usr.UserName == adminUser.UserName)) context.SiteUsers.Add(adminUser);

            base.Seed(context);
        }
    }
}
