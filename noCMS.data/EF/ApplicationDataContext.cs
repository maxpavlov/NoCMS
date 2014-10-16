using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using noCMS.data.Entities;
using noCMS.data.Migrations;

namespace noCMS.data.EF
{
    public class ApplicationDataContext: DbContext
    {
        public DbSet<SiteUser> SiteUsers { get; set; }
        public DbSet<SiteUserRole> UserRoles { get; set; }
        public DbSet<PersonItem> PersonItems { get; set; }

        public DbSet<Content> ContentElements { get; set; }
        
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            // Tell Code First to ignore PluralizingTableName convention
            // If you keep this convention then the generated tables will have pluralized names.
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            //set the initializer to migration
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<ApplicationDataContext, Configuration>());
        }

        public ApplicationDataContext()
            : base("AppDataContext")
        {

        }
    }
}
