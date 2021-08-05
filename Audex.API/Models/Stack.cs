using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Audex.API.Models
{
    public class Stack : BaseEntity
    {
        [Required]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public VanityName VanityName
        {
            get
            {
                if (Name is not null && !String.IsNullOrWhiteSpace(Name))
                    return new VanityName { Name = Name, Suffix = "" };
                if (Files is null)
                    return new VanityName { Name = "", Suffix = "No vanity name. Make sure to include Stack.Files to generate one." };
                if (Files.Count == 0)
                    return new VanityName { Name = "", Suffix = "Empty stack" };
                if (Files.Count == 1)
                    return new VanityName { Name = Files[0].Name, Suffix = " by itself" };
                return new VanityName { Name = Files[0].Name, Suffix = $" and {Files.Count} other files" };
            }
        }
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
    public class VanityName
    {
        public string Name { get; set; }
        public string Suffix { get; set; }
    }
}