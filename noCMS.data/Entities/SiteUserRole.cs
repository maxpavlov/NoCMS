using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace noCMS.data.Entities
{
    public class SiteUserRole: IdableEntity
    {
        [Required]
        public string RoleName { get; set; }

        public string Description { get; set; }

        public bool AdminFeaturesAvailable { get; set; }

        public virtual IList<SiteUser> SiteUsers { get; set; }
    }
}
