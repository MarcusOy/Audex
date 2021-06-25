using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Audex.API.Models
{
    public class User : BaseEntity
    {
        [Required, JsonIgnore]
        public Guid Id { get; set; }
        [Required]
        public string Username { get; set; }
        [Required, JsonIgnore]
        public string Password { get; set; }
        [Required, JsonIgnore]
        public string Salt { get; set; }
        // [Required] // TODO: reactivate this when encryption is implemented
        public string PublicKey { get; set; }
        public string TwoFactorKey { get; set; }
        [Required]
        public Boolean Active { get; set; }

        // Token Relationship
        [JsonIgnore]
        public List<AuthToken> Tokens { get; set; }

        // Group Relationship
        public int GroupId { get; set; }
        [JsonIgnore]
        public Group Group { get; set; }

        // Device Relationship
        [JsonIgnore]
        public List<Device> Devices { get; set; }
    }
}