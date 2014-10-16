using System;
using System.Collections.Generic;
using System.Linq;
using noCMS.data.Entities;

namespace noCMS.data.Repositories
{
    public interface IApplicationUserRepository
    {
        IQueryable<SiteUser> GetAllUsers();

        SiteUser GetUser(Guid userId);
        SiteUser GetUser(string userName);

        int GetNumberOfUsersActiveAfter(DateTime afterWhen);

        int CountUsersWithName(string nameToMatch);
        IQueryable<SiteUser> UsersWithNamePattern(string nameToMatch);

        int TotalUsersCount();

        IQueryable<SiteUser> GetUsersAsQueryable();

        IQueryable<SiteUser> GetUsersInRole(string roleName);
        IQueryable<SiteUser> GetUsersInRole(Guid roleId);
        IQueryable<SiteUser> GetUsersInRole(SiteUserRole role);
        IQueryable<SiteUserRole> GetAllRoles();

        SiteUserRole GetRole(Guid id);

        SiteUserRole GetRole(string name);

        IList<SiteUserRole> GetRolesForUser(string userName);
        IList<SiteUserRole> GetRolesForUser(Guid userId);
        IList<SiteUserRole> GetRolesForUser(SiteUser user);

        SiteUser CreateUser(string username, string password, string email);
        SiteUser CreateUser(string username, string password, string email, string displayName);

        void DeleteUser(SiteUser user);
        void DeleteUser(string userName);


        void AddRole(SiteUserRole role);
        void AddRole(string roleName);

        void AddRoleToUser(Guid userId, string roleName);
        void AddRoleToUser(string userName, string roleName);
        void AddRoleToUser(SiteUser user, SiteUserRole role);

        void DeleteRole(SiteUserRole role);
        void DeleteRole(string roleName);

        void SaveChanges();

        bool UserExists(SiteUser user);
        bool RoleExists(SiteUserRole role);
        bool UserNameTaken(string userName);
        void ClearUserRoles(string userName);
    }
}
