using System;
using System.ComponentModel.DataAnnotations;

namespace Audex.API.Models.Auth
{
    public class AuthToken : BaseEntity
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public bool IsRefreshToken { get; set; }
        [Required]
        public string Token { get; set; }
        [Required]
        public DateTime ExpiresOn { get; set; }
        public bool IsExpired => DateTime.UtcNow >= ExpiresOn;
        [Required]
        public string CreatedByIP { get; set; }

        public DateTime? RevokedOn { get; set; }
        public string RevokedByIP { get; set; }
        public bool IsActive => RevokedOn == null && !IsExpired;

        // User relationship
        public Guid UserId { get; set; }
        public User User { get; set; }

        // Device relationship
        public Guid DeviceId { get; set; }
        public Device Device { get; set; }

        // Token relationship
        public Guid? ReplacedByTokenId { get; set; }
        public AuthToken ReplacedByToken { get; set; }

    }
}