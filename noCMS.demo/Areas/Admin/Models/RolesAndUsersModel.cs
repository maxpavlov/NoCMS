using System.Collections.Generic;
using noCMS.demo.Application.Membership;

namespace noCMS.demo.Areas.Admin.Models
{
    public class RolesAndUsersModel
    {
        public List<RoleModel> RoleModels { get; set; }
        public List<ApplicationMembershipUser> UsersInFirstRole { get; set; } 
    }

    public class RoleModel
    {
        public string RoleName { get; set; }
        public int RoleUsersCount { get; set; }
        public bool AdminFeaturesAvailable { get; set; }
    }

}