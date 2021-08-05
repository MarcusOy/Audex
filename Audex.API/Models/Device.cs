using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using HotChocolate;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Audex.API.Models
{
    public class Device : BaseEntity
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        [JsonIgnore]
        public string NotificationIdentifier { get; set; }
        public bool IsFirstTimeSetup { get; set; }

        // User Relationship
        [Required]
        public Guid UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }

        // DeviceType Relationship
        [Required]
        public DeviceTypeEnum DeviceTypeId { get; set; }
        [JsonIgnore]
        public DeviceType DeviceType { get; set; }

        // Transfer Relationship
        public List<Transfer> IncomingTransfers { get; set; }
        public List<Transfer> OutgoingTransfers { get; set; }
    }

    public class DeviceType : BaseEntity
    {
        [Required]
        public DeviceTypeEnum Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Color { get; set; }

        // Device Relationship
        public List<Device> Devices { get; set; }
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum DeviceTypeEnum
    {
        [GraphQLDescription("Audex Server")]
        AudexServer = 1,
        [GraphQLDescription("Windows")]
        Windows = 2,
        [GraphQLDescription("MacOS")]
        MacOS = 3,
        [GraphQLDescription("Linux")]
        Linux = 4,
        [GraphQLDescription("Web")]
        Web = 5,
        [GraphQLDescription("iOS")]
        iOS = 6,
        [GraphQLDescription("Android")]
        Android = 7,
        [GraphQLDescription("Other")]
        Other = 8
    }
}