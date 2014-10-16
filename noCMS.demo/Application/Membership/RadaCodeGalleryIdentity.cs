using System.Security.Principal;
using System.Web.Script.Serialization;
using System.Web.Security;

namespace noCMS.demo.Application.Membership
{
    public class ApplicationIdentity : IIdentity
    {
        public string Name { get; private set; }
        public string AuthenticationType { get; private set; }
        public bool IsAuthenticated { get; private set; }
        public string DisplayName { get; private set; }
        public string Role { get; private set; }

        public ApplicationIdentity(FormsAuthenticationTicket ticket)
        {
            this.AuthenticationType = "Custom Authentication";
            this.Name = ticket.Name;

            var serializer = new JavaScriptSerializer();
            var model = serializer.Deserialize<ApplicationIdentityUserDataModel>(ticket.UserData);

            this.DisplayName = model.DisplayName;
            this.Role = model.PrimaryRole;
            this.IsAuthenticated = true;
        }
    }

    public class ApplicationIdentityUserDataModel
    {
        public string DisplayName { get; set; }
        public string PrimaryRole { get; set; }
    }

}