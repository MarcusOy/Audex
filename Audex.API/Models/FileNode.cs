using System;
using System.ComponentModel.DataAnnotations;

namespace Audex.API.Models
{
    public class FileNode : BaseEntity
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string FileExtension { get; set; }
        public long FileSize { get; set; }
        // User Relationship
        [Required]
        public Guid OwnerUserId { get; set; }
        public User OwnerUser { get; set; }

        // Device Relationship
        [Required]
        public Guid UploadedByDeviceId { get; set; }
        public Device UploadedByDevice { get; set; }

        // FileNode Relationship - Parent
        public Guid? ParentStackId { get; set; }
        public Stack ParentStack { get; set; }
    }
}