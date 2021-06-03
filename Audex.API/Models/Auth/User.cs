using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Audex.API.Models.Stacks;

namespace Audex.API.Models.Auth
{
    public class User : BaseEntity
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string Salt { get; set; }
        // [Required] // TODO: reactivate this when encryption is implemented
        public string PublicKey { get; set; }
        public string TwoFactorKey { get; set; }
        [Required]
        public Boolean Active { get; set; }

        // Token Relationship
        public List<AuthToken> Tokens { get; set; }

        // Group Relationship
        public int GroupId { get; set; }
        public Group Group { get; set; }

        // Device Relationship
        public List<Device> Devices { get; set; }
    }
}