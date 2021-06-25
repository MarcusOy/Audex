using System;
using System.Text.Json.Serialization;

namespace Audex.API.Models
{
    public class BaseEntity
    {
        [JsonIgnore]
        public DateTime CreatedOn { get; set; }
        [JsonIgnore]
        public DateTime UpdatedOn { get; set; }
        [JsonIgnore]
        public DateTime? DeletedOn { get; set; }
    }
}