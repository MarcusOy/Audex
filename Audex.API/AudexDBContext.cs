using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

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
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public DateTime DateCreated { get; set; }
        public Boolean Active { get; set; }

        // Group Relationship
        public int GroupId { get; set; }
        public Group Group { get; set; }

        // Device Relationship
        public List<Device> Devices { get; set; }
    }

    public class Group
    {
        public int Id { get; set; }
        public string Name { get; set; }

        // User Relationship
        public List<User> Users { get; set; }
    }

    public class Device
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }

        // DeviceType Relationship
        public int DeviceTypeId { get; set; }
        public DeviceType DeviceType { get; set; }

        // User Relationship
        public Guid UserId { get; set; }
        public User User { get; set; }
    }

    public class DeviceType
    {
        public int Id { get; set; }
        public string Name { get; set; }

        // Device Relationship
        public List<Device> Devices { get; set; }
    }

    public class File
    {
        public Guid Id { get; set; }
        public string FileName { get; set; }
        public DateTime DateUploaded { get; set; }
        public Boolean IsPersistant { get; set; }
        public string OriginalPersistantPath { get; set; }
        public DateTime ExpiryDate { get; set; }

        // Device Relationship
        public Guid UploadedByDeviceId { get; set; }
        public Device UploadedByDevice { get; set; }
        public Guid RecipientDeviceId { get; set; }
        public Device RecipientDevice { get; set; }

        // FileType Relationship
        public int FileTypeId { get; set; }
        public FileType FileType { get; set; }

    }

    public class FileType
    {
        public int Id { get; set; }
        public string Name { get; set; }

        // File Relationship
        public List<File> Files { get; set; }

        // FileExtension Relationship
        public List<FileExtension> FileExtensions { get; set; }
    }

    public class FileExtension
    {
        public int Id { get; set; }
        public string Name { get; set; }

        // FileType Relationship
        public int FileTypeId { get; set; }
        public FileType FileType { get; set; }
    }
}