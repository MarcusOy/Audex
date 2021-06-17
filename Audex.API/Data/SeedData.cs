using Audex.API.Models.Auth;
using Microsoft.EntityFrameworkCore;

namespace Audex.API.Data
{
    public static class SeedData
    {
        public static void HasAudexData(this ModelBuilder builder)
        {
            builder.HasRoles();
            builder.HasGroups();
            builder.HasGroupRoles();
            builder.HasDeviceTypes();
        }

        // TODO: make these dynamic or based from file/db
        private static void HasRoles(this ModelBuilder builder)
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
        }
        private static void HasGroups(this ModelBuilder builder)
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
        }
        private static void HasGroupRoles(this ModelBuilder builder)
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
        }
        private static void HasDeviceTypes(this ModelBuilder builder)
        {
            builder.Entity<DeviceType>().HasData(
                new DeviceType
                {
                    Id = 1,
                    Name = "Audex Server",
                    Color = "#2196F2"
                },
                new DeviceType
                {
                    Id = 2,
                    Name = "Windows",
                    Color = "#00aef0"
                },
                new DeviceType
                {
                    Id = 3,
                    Name = "MacOS",
                    Color = "#ffffff"
                },
                new DeviceType
                {
                    Id = 4,
                    Name = "Linux",
                    Color = "#dd4814"
                },
                new DeviceType
                {
                    Id = 5,
                    Name = "Web",
                    Color = "#DD5144"
                },
                new DeviceType
                {
                    Id = 6,
                    Name = "iOS",
                    Color = "#ffffff"
                },
                new DeviceType
                {
                    Id = 7,
                    Name = "Android",
                    Color = "#3DDC84"
                },
                new DeviceType
                {
                    Id = 8,
                    Name = "Other",
                    Color = "#46483e"
                }
            );
        }
    }
}