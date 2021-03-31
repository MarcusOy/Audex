using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Audex.API.Models.Auth;

namespace Audex.API.Models.Auth
{
    public class Device : BaseEntity
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string NotificationIdentifier { get; set; }

        // DeviceType Relationship
        [Required]
        public int DeviceTypeId { get; set; }
        public DeviceType DeviceType { get; set; }

        // User Relationship
        [Required]
        public Guid UserId { get; set; }
        public User User { get; set; }
    }

    public class DeviceType : BaseEntity
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }

        // Device Relationship
        public List<Device> Devices { get; set; }
    }
}