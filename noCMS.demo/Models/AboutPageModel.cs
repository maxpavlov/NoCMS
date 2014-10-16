using System.Collections.Generic;
using noCMS.data.Entities;

namespace noCMS.demo.Models
{
    public class AboutPageModel
    {
        public string AboutMarkup { get; set; }
        public List<PersonItem> PersonItems { get; set; }
    }
}