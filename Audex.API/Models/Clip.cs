using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using HotChocolate;

namespace Audex.API.Models
{
    public class Clip : BaseEntity
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string Content { get; set; }
        public bool IsSecured { get; set; }

        // User Relationship
        [Required]
        public Guid OwnerUserId { get; set; }
        public User OwnerUser { get; set; }

        // Device Relationship
        [Required]
        public Guid UploadedByDeviceId { get; set; }
        public Device UploadedByDevice { get; set; }
    }
}