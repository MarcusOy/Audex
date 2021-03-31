using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Audex.API.Models.Auth;

namespace Audex.API.Models.Stacks
{
    public class Stack : BaseEntity
    {
        [Required]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime? ExpiryDate { get; set; }

        // StackCategory Relationship
        public Guid? StackCategoryId { get; set; }
        public StackCategory StackCategory { get; set; }

        // User Relationship
        [Required]
        public Guid OwnerUserId { get; set; }
        public User OwnerUser { get; set; }

        // Device Relationship
        [Required]
        public Guid UploadedByDeviceId { get; set; }
        public Device UploadedByDevice { get; set; }

        // FileNode Relationship
        public List<FileNode> Files { get; set; }
    }
    public class StackCategory : BaseEntity
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Color { get; set; }

        // User Relationship
        [Required]
        public Guid OwnerUserId { get; set; }
        public User OwnerUser { get; set; }

        // Stack Relationship
        public List<Stack> Stacks { get; set; }
    }
}