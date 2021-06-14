using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Audex.API.Models.Auth
{
    public class Device : BaseEntity
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string NotificationIdentifier { get; set; }

        // User Relationship
        [Required]
        public Guid UserId { get; set; }
        public User User { get; set; }

        // DeviceType Relationship
        public int DeviceTypeId { get; set; }
        public DeviceType DeviceType { get; set; }
    }

    public class DeviceType : BaseEntity
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Color { get; set; }

        // Device Relationship
        public List<Device> Devices { get; set; }
    }
}