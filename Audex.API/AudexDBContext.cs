using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Audex.API
{
    public class AudexDBContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Device> Devices { get; set; }
        public DbSet<DeviceType> DeviceTypes { get; set; }
        public DbSet<File> Files { get; set; }
        public DbSet<FileType> FilesTypes { get; set; }
        public DbSet<FileExtension> FileExtensions { get; set; }

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
        [Required]
        public DateTime DateCreated { get; set; }
        [Required]
        public Boolean Active { get; set; }

        // Group Relationship
        public int GroupId { get; set; }
        public Group Group { get; set; }

        // Device Relationship
        public List<Device> Devices { get; set; }
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
        public int DeviceTypeId { get; set; }
        public DeviceType DeviceType { get; set; }

        // User Relationship
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

    public class File
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string FileName { get; set; }
        [Required]
        public DateTime DateUploaded { get; set; }
        [Required]
        public Boolean IsPersistant { get; set; }
        public string OriginalPersistantPath { get; set; }
        public DateTime ExpiryDate { get; set; }

        // Device Relationship
        [Required]
        public Guid UploadedByDeviceId { get; set; }
        public Device UploadedByDevice { get; set; }
        public Guid RecipientDeviceId { get; set; }
        public Device RecipientDevice { get; set; }

        // FileType Relationship
        [Required]
        public int FileTypeId { get; set; }
        public FileType FileType { get; set; }

    }

    public class FileType
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }

        // File Relationship
        public List<File> Files { get; set; }

        // FileExtension Relationship
        public List<FileExtension> FileExtensions { get; set; }
    }

    public class FileExtension
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }

        // FileType Relationship
        public int FileTypeId { get; set; }
        public FileType FileType { get; set; }
    }
}