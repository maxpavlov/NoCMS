using Ninject.Modules;

namespace noCMS.core
{
   public class CoreModule : NinjectModule
    {
       public override void Load()
       {
            Bind<IApplicationSettings>().To<LocalDevelopmentApplicationSettings>().InSingletonScope();
       }
    }

}
