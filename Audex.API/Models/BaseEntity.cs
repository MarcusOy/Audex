using System;

namespace Audex.API.Models
{
    public class BaseEntity
    {
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
        public DateTime? DeletedOn { get; set; }
    }
}