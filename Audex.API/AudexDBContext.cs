using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Audex.API
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
        public DbSet<Drive> Drives { get; set; }
        public DbSet<FileNode> FileNodes { get; set; }
        public DbSet<Transfer> Transfers { get; set; }
        public DbSet<Share> Shares { get; set; }
        public DbSet<Activity> Activity { get; set; }
        // public DbSet<FileType> FilesTypes { get; set; }
        // public DbSet<FileExtension> FileExtensions { get; set; }

        public AudexDBContext(DbContextOptions<AudexDBContext> options)
            : base(options)
        { }

        // protected override void OnConfiguring(DbContextOptionsBuilder options)
        //     => options.UseMySql("server=localhost:3306;user=audexapp;password=!audexapp!;database=audex", new MySqlServerVersion(new Version(5, 7, 32)));
    }

    public class User
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string Salt { get; set; }
        // [Required] // TODO: reactivate this when encryption is implemented
        public string PublicKey { get; set; }
        [Required]
        public DateTime DateCreated { get; set; }
        [Required]
        public Boolean Active { get; set; }

        // Token Relationship
        public List<AuthToken> Tokens { get; set; }

        // Group Relationship
        public int GroupId { get; set; }
        public Group Group { get; set; }

        // Device Relationship
        public List<Device> Devices { get; set; }
    }

    public class AuthToken
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public bool IsRefreshToken { get; set; }
        [Required]
        public string Token { get; set; }
        [Required]
        public DateTime ExpiresOn { get; set; }
        public bool IsExpired => DateTime.UtcNow >= ExpiresOn;
        [Required]
        public DateTime CreatedOn { get; set; }
        [Required]
        public string CreatedByIP { get; set; }

        public DateTime? RevokedOn { get; set; }
        public string RevokedByIP { get; set; }
        public bool IsActive => RevokedOn == null && !IsExpired;

        // User relationship
        public Guid UserId { get; set; }
        public User User { get; set; }

        // Token relationship
        public Guid? ReplacedByTokenId { get; set; }
        public AuthToken ReplacedByToken { get; set; }

    }
    public class Group
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }

        // User Relationship
        public List<User> Users { get; set; }

        // GroupRole Relationship
        public List<GroupRole> GroupRoles { get; set; }
    }

    public class GroupRole
    {
        [Required]
        public int Id { get; set; }

        // Group Relationship
        [Required]
        public int GroupId { get; set; }
        public Group Group { get; set; }

        // Role Relationship
        [Required]
        public int RoleId { get; set; }
        public Role Role { get; set; }

    }

    public class Role
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }

        // GroupRole Relationship
        public List<GroupRole> GroupRoles { get; set; }

    }

    public class Device
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }

        // DeviceType Relationship
        [Required]
        public int DeviceTypeId { get; set; }
        public DeviceType DeviceType { get; set; }

        // User Relationship
        [Required]
        public Guid UserId { get; set; }
        public User User { get; set; }
    }

    public class DeviceType
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }

        // Device Relationship
        public List<Device> Devices { get; set; }
    }

    public class Drive
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public Guid OwnerUserId { get; set; }
        public User OwnerUser { get; set; }
        [Required]
        public Guid RootFileNodeId { get; set; }
        public FileNode RootFileNode { get; set; }
    }
    public class FileNode
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public bool IsDirectory { get; set; }
        [Required]
        public string Name { get; set; }
        public string FileExtension { get; set; }
        public long FileSize { get; set; }
        [Required]
        public DateTime DateCreated { get; set; }

        public DateTime? ExpiryDate { get; set; }

        // User Relationship
        [Required]
        public Guid OwnerUserId { get; set; }
        public User OwnerUser { get; set; }

        // Device Relationship
        public Guid UploadedByDeviceId { get; set; }
        public Device UploadedByDevice { get; set; }

        // FileNode Relationship - Parent
        public Guid? ParentFileNodeId { get; set; }
        public FileNode ParentFileNode { get; set; }

        // FileNode Relationship - Children
        public List<FileNode> ChildrenFileNodes { get; set; }
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

    public class Transfer
    {
        [Required]
        public Guid Id { get; set; }

        public DateTime? ExpiryDate { get; set; }
        public bool IsFullfilled { get; set; }

        // FileNode Relationship
        [Required]
        public Guid FileNodeId { get; set; }
        public FileNode FileNode { get; set; }

        // Device Relationship
        [Required]
        public Guid SenderDeviceId { get; set; }
        public Device SenderDevice { get; set; }
        public Guid? ReceivingDeviceId { get; set; }
        public Device ReceivingrDevice { get; set; }

        // User Relationship
        [Required]
        public Guid SenderUserId { get; set; }
        public User SenderUser { get; set; }
        public Guid? ReceivingUserId { get; set; }
        public User ReceivingUser { get; set; }
    }

    public class Share
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

    public class Activity
    {
        [Required]
        public int Id { get; set; }
        public string Message { get; set; } // Will have placeholders, such as {u}, {u2}, {d}, {f}

        // User Relationship
        public Guid? UserId { get; set; } // Will be activity originator
        public User User { get; set; }
        public Guid? User2Id { get; set; } // Will be optional receipient
        public User User2 { get; set; }

        // Device Relationship
        public Guid? DeviceId { get; set; } // Will be optional device receipient
        public Device Device { get; set; }

        // FileNode Relationship
        public Guid? FileNodeId { get; set; } // Will be optional file node involved in activity
        public FileNode FileNode { get; set; }

    }


}