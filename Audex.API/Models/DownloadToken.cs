using System;
using System.ComponentModel.DataAnnotations;

namespace Audex.API.Models
{
    public class DownloadToken : BaseEntity
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public int NumberOfUses { get; set; }
        [Required]
        public int MaxNumberOfUses { get; set; }
        public DateTime? ExpiresOn { get; set; }

        // FileNode relationship
        public Guid FileNodeId { get; set; }
        public FileNode FileNode { get; set; }

        // User relationship
        public Guid? ForUserId { get; set; } // if null, token is public
        public User ForUser { get; set; }

    }
}