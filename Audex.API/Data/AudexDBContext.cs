using Audex.API.Models.Auth;
using Audex.API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Audex.API.Models.Stacks;

namespace Audex.API.Data
{
    public class AudexDBContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<AuthToken> AuthTokens { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<GroupRole> GroupRoles { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Device> Devices { get; set; }
        public DbSet<DeviceType> DeviceTypes { get; set; }
        public DbSet<Stack> Stack { get; set; }
        public DbSet<StackCategory> StackCategory { get; set; }
        public DbSet<FileNode> FileNodes { get; set; }
        public DbSet<DownloadToken> DownloadTokens { get; set; }
        // public DbSet<Transfer> Transfers { get; set; }
        public DbSet<Share> Shares { get; set; }
        // public DbSet<Activity> Activity { get; set; }
        // public DbSet<FileType> FilesTypes { get; set; }
        // public DbSet<FileExtension> FileExtensions { get; set; }

        public AudexDBContext(DbContextOptions<AudexDBContext> options)
            : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.HasAudexData();
        }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            OnBeforeSaving();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }

        public override async Task<int> SaveChangesAsync(
           bool acceptAllChangesOnSuccess,
           CancellationToken cancellationToken = default(CancellationToken)
        )
        {
            OnBeforeSaving();
            return (await base.SaveChangesAsync(acceptAllChangesOnSuccess,
                          cancellationToken));
        }

        private void OnBeforeSaving()
        {
            var entries = ChangeTracker.Entries();
            var utcNow = DateTime.UtcNow;

            foreach (var entry in entries)
            {
                // for entities that inherit from BaseEntity,
                // set UpdatedOn / CreatedOn appropriately
                if (entry.Entity is BaseEntity trackable)
                {
                    switch (entry.State)
                    {
                        case EntityState.Modified:
                            // set the updated date to "now"
                            trackable.UpdatedOn = utcNow;

                            // mark property as "don't touch"
                            // we don't want to update on a Modify operation
                            entry.Property("CreatedOn").IsModified = false;
                            break;

                        case EntityState.Added:
                            // set both updated and created date to "now"
                            trackable.CreatedOn = utcNow;
                            trackable.UpdatedOn = utcNow;
                            break;
                    }
                }
            }
        }
        // protected override void OnConfiguring(DbContextOptionsBuilder options)
        //     => options.UseMySql("server=localhost:3306;user=audexapp;password=!audexapp!;database=audex", new MySqlServerVersion(new Version(5, 7, 32)));
    }





    // public class File
    // {
    //     [Required]
    //     public Guid Id { get; set; }


    //     // FileNode Relationship
    //     public Guid FileNodeId { get; set; }
    //     public FileNode FileNode { get; set; }

    //     // Device Relationship
    //     [Required]
    //     public Guid UploadedByDeviceId { get; set; }
    //     public Device UploadedByDevice { get; set; }

    //     // FileType Relationship
    //     [Required]
    //     public int FileTypeId { get; set; }
    //     public FileType FileType { get; set; }

    // }

    // public class FileType
    // {
    //     [Required]
    //     public int Id { get; set; }
    //     [Required]
    //     public string Name { get; set; }

    //     // File Relationship
    //     public List<File> Files { get; set; }

    //     // FileExtension Relationship
    //     public List<FileExtension> FileExtensions { get; set; }
    // }

    // public class FileExtension
    // {
    //     [Required]
    //     public int Id { get; set; }
    //     [Required]
    //     public string Name { get; set; }

    //     // FileType Relationship
    //     public int FileTypeId { get; set; }
    //     public FileType FileType { get; set; }
    // }

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

    // public class Transfer : BaseEntity
    // {
    //     [Required]
    //     public Guid Id { get; set; }

    //     public DateTime? ExpiryDate { get; set; }
    //     public bool IsFullfilled { get; set; }

    //     // FileNode Relationship
    //     [Required]
    //     public Guid FileNodeId { get; set; }
    //     public FileNode FileNode { get; set; }

    //     // Device Relationship
    //     [Required]
    //     public Guid SenderDeviceId { get; set; }
    //     public Device SenderDevice { get; set; }
    //     public Guid? ReceivingDeviceId { get; set; }
    //     public Device ReceivingrDevice { get; set; }

    //     // User Relationship
    //     [Required]
    //     public Guid SenderUserId { get; set; }
    //     public User SenderUser { get; set; }
    //     public Guid? ReceivingUserId { get; set; }
    //     public User ReceivingUser { get; set; }
    // }

    public class Share : BaseEntity
    {
        [Required]
        public Guid Id { get; set; }

        public string UrlExtension { get; set; }
        public int PIN { get; set; }
        public int TimesUsed { get; set; }

        public DateTime? ExpiryDate { get; set; }

        // FileNode Relationship
        [Required]
        public Guid FileNodeId { get; set; }
        public FileNode FileNode { get; set; }
    }

    // public class Activity : BaseEntity
    // {
    //     [Required]
    //     public int Id { get; set; }
    //     public string Message { get; set; } // Will have placeholders, such as {u}, {u2}, {d}, {f}

    //     // User Relationship
    //     public Guid? UserId { get; set; } // Will be activity originator
    //     public User User { get; set; }
    //     public Guid? User2Id { get; set; } // Will be optional receipient
    //     public User User2 { get; set; }

    //     // FileNode Relationship
    //     public Guid? FileNodeId { get; set; } // Will be optional file node involved in activity
    //     public FileNode FileNode { get; set; }

    // }


}