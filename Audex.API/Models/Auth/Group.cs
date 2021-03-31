using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Audex.API.Models.Auth
{
    public class Group : BaseEntity
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

    public class GroupRole : BaseEntity
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

    public class Role : BaseEntity
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }

        // GroupRole Relationship
        public List<GroupRole> GroupRoles { get; set; }

    }
}