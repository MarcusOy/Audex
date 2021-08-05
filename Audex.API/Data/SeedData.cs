using Audex.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Audex.API.Data
{
    public static class SeedData
    {
        public static void HasAudexData(this ModelBuilder builder)
        {
            builder.HasRoles()
                .HasGroups()
                .HasGroupRoles()
                .HasDeviceTypes();
        }

        // TODO: make these dynamic or based from file/db
        private static ModelBuilder HasRoles(this ModelBuilder builder)
        {
            builder.Entity<Role>().HasData(
                new Role
                {
                    Id = 1,
                    Name = "Login"
                },
                new Role
                {
                    Id = 2,
                    Name = "UploadFiles"
                },
                new Role
                {
                    Id = 3,
                    Name = "ViewFiles"
                },
                new Role
                {
                    Id = 4,
                    Name = "UserManagement"
                },
                new Role
                {
                    Id = 5,
                    Name = "DeviceManagement"
                },
                new Role
                {
                    Id = 6,
                    Name = "PrivatelyShareFiles"
                },
                new Role
                {
                    Id = 7,
                    Name = "PubliclyShareFiles"
                }
            );
            return builder;
        }
        private static ModelBuilder HasGroups(this ModelBuilder builder)
        {
            builder.Entity<Group>().HasData(
                new Group
                {
                    Id = 1,
                    Name = "Administrator"
                },
                new Group
                {
                    Id = 2,
                    Name = "Member"
                },
                new Group
                {
                    Id = 3,
                    Name = "Viewer"
                }
            );
            return builder;

        }
        private static ModelBuilder HasGroupRoles(this ModelBuilder builder)
        {
            builder.Entity<GroupRole>().HasData(
                new GroupRole
                {
                    Id = 1,
                    GroupId = 1,
                    RoleId = 1
                },
                new GroupRole
                {
                    Id = 2,
                    GroupId = 1,
                    RoleId = 2
                },
                new GroupRole
                {
                    Id = 3,
                    GroupId = 1,
                    RoleId = 3
                },
                new GroupRole
                {
                    Id = 4,
                    GroupId = 1,
                    RoleId = 4
                },
                new GroupRole
                {
                    Id = 5,
                    GroupId = 1,
                    RoleId = 5
                },
                new GroupRole
                {
                    Id = 6,
                    GroupId = 1,
                    RoleId = 6
                },
                new GroupRole
                {
                    Id = 7,
                    GroupId = 1,
                    RoleId = 7
                },
                new GroupRole
                {
                    Id = 8,
                    GroupId = 2,
                    RoleId = 1
                },
                new GroupRole
                {
                    Id = 9,
                    GroupId = 2,
                    RoleId = 2
                },
                new GroupRole
                {
                    Id = 10,
                    GroupId = 2,
                    RoleId = 3
                },
                new GroupRole
                {
                    Id = 11,
                    GroupId = 2,
                    RoleId = 6
                }
            );
            return builder;
        }
        private static ModelBuilder HasDeviceTypes(this ModelBuilder builder)
        {
            builder.Entity<DeviceType>().HasData(
                new DeviceType
                {
                    Id = DeviceTypeEnum.AudexServer,
                    Name = "Audex Server",
                    Color = "#2196F2"
                },
                new DeviceType
                {
                    Id = DeviceTypeEnum.Windows,
                    Name = "Windows",
                    Color = "#00aef0"
                },
                new DeviceType
                {
                    Id = DeviceTypeEnum.MacOS,
                    Name = "MacOS",
                    Color = "#000"
                },
                new DeviceType
                {
                    Id = DeviceTypeEnum.Linux,
                    Name = "Linux",
                    Color = "#f7c700"
                },
                new DeviceType
                {
                    Id = DeviceTypeEnum.Web,
                    Name = "Web",
                    Color = "#DD5144"
                },
                new DeviceType
                {
                    Id = DeviceTypeEnum.iOS,
                    Name = "iOS",
                    Color = "#000"
                },
                new DeviceType
                {
                    Id = DeviceTypeEnum.Android,
                    Name = "Android",
                    Color = "#3DDC84"
                },
                new DeviceType
                {
                    Id = DeviceTypeEnum.Other,
                    Name = "Other",
                    Color = "#46483e"
                }
            );
            return builder;
        }
    }
}