using System;
using System.ComponentModel.DataAnnotations;
using System.Threading;

namespace noCMS.data.Entities
{
    public abstract class IdableEntity
    {
        [Key]
        public Guid Id { get; set; }
        public int Version { get; set; }

        protected IdableEntity()
        {
            Id = Guid.NewGuid();
        }
    }

    public abstract class LocalizeableIdableEntity : IdableEntity
    {
        [Required]
        public string Culture { get; set; }

        protected LocalizeableIdableEntity()
            : base()
        {
            Culture = Thread.CurrentThread.CurrentCulture.TwoLetterISOLanguageName;
        }
    }
}
