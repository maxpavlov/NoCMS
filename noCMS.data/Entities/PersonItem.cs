using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace noCMS.data.Entities
{
    public class PersonItem : LocalizeableIdableEntity
    {
        public string FullName { get; set; }
        public string Position { get; set; }
        public string Description { get; set; }

    }
}
