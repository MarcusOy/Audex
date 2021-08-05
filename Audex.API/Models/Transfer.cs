using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using HotChocolate;

namespace Audex.API.Models
{
    public class Transfer : BaseEntity
    {
        [Required]
        public Guid Id { get; set; }

        public DateTime? ExpiryDate { get; set; }
        public TransferStatus Status { get; set; }

        // Stack Relationship
        [Required]
        public Guid StackId { get; set; }
        public Stack Stack { get; set; }

        // User Relationship
        [Required]
        public Guid FromUserId { get; set; }
        public User FromUser { get; set; }
        public Guid ToUserId { get; set; }
        public User ToUser { get; set; }

        // Device Relationship
        [Required]
        public Guid FromDeviceId { get; set; }
        public Device FromDevice { get; set; }
        public Guid ToDeviceId { get; set; }
        public Device ToDevice { get; set; }
    }

    public enum TransferStatus
    {
        [GraphQLDescription("Pending")]
        Pending = 1,
        [GraphQLDescription("Accepted")]
        Accepted = 2,
        [GraphQLDescription("Declined")]
        Declined = 3
    }
}