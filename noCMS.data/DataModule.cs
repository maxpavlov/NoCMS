using Ninject.Modules;
using Ninject.Web.Common;
using noCMS.data.EF;
using noCMS.data.Repositories;

namespace noCMS.data
{
    public class DataModule : NinjectModule
    {
        public override void Load()
        {
            Bind<ApplicationDataContext>().ToSelf().InRequestScope();
            Bind<IApplicationUserRepository>().To<ApplicationUserRepository>().InRequestScope();
        }
    }

}
