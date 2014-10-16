using System.ComponentModel.DataAnnotations;

namespace noCMS.demo.Areas.Admin.Models
{
    public class LoginModel
    {
        [Required]
        [Display(Name = "Login")]
        public string Name { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Pazz { get; set; }
    }
}