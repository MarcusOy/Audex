﻿// <auto-generated />
using System;
using Audex.API;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Audex.API.Migrations
{
    [DbContext(typeof(AudexDBContext))]
    [Migration("20210105064337_AddDrives")]
    partial class AddDrives
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 64)
                .HasAnnotation("ProductVersion", "5.0.1");

            modelBuilder.Entity("Audex.API.Activity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<Guid>("DeviceId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("FileNodeId")
                        .HasColumnType("char(36)");

                    b.Property<string>("Message")
                        .HasColumnType("longtext");

                    b.Property<Guid>("User2Id")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("UserId")
                        .HasColumnType("char(36)");

                    b.HasKey("Id");

                    b.HasIndex("DeviceId");

                    b.HasIndex("FileNodeId");

                    b.HasIndex("User2Id");

                    b.HasIndex("UserId");

                    b.ToTable("Activity");
                });

            modelBuilder.Entity("Audex.API.Device", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<int>("DeviceTypeId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<Guid>("UserId")
                        .HasColumnType("char(36)");

                    b.HasKey("Id");

                    b.HasIndex("DeviceTypeId");

                    b.HasIndex("UserId");

                    b.ToTable("Devices");
                });

            modelBuilder.Entity("Audex.API.DeviceType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("DeviceTypes");
                });

            modelBuilder.Entity("Audex.API.Drive", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<Guid>("OwnerUserId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("RootFileNodeId")
                        .HasColumnType("char(36)");

                    b.HasKey("Id");

                    b.HasIndex("OwnerUserId");

                    b.HasIndex("RootFileNodeId");

                    b.ToTable("Drives");
                });

            modelBuilder.Entity("Audex.API.FileNode", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("ExpiryDate")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("FileExtension")
                        .HasColumnType("longtext");

                    b.Property<long>("FileSize")
                        .HasColumnType("bigint");

                    b.Property<bool>("IsDirectory")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<Guid>("OwnerUserId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("ParentFileNodeId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("UploadedByDeviceId")
                        .HasColumnType("char(36)");

                    b.HasKey("Id");

                    b.HasIndex("OwnerUserId");

                    b.HasIndex("ParentFileNodeId");

                    b.HasIndex("UploadedByDeviceId");

                    b.ToTable("FileNodes");
                });

            modelBuilder.Entity("Audex.API.Group", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Groups");
                });

            modelBuilder.Entity("Audex.API.GroupRole", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("GroupId")
                        .HasColumnType("int");

                    b.Property<int>("RoleId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("GroupId");

                    b.HasIndex("RoleId");

                    b.ToTable("GroupRoles");
                });

            modelBuilder.Entity("Audex.API.Role", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("Audex.API.Share", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<DateTime>("ExpiryDate")
                        .HasColumnType("datetime(6)");

                    b.Property<Guid>("FileNodeId")
                        .HasColumnType("char(36)");

                    b.Property<int>("PIN")
                        .HasColumnType("int");

                    b.Property<string>("UrlExtension")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("FileNodeId");

                    b.ToTable("Shares");
                });

            modelBuilder.Entity("Audex.API.Transfer", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<Guid>("FileNodeId")
                        .HasColumnType("char(36)");

                    b.HasKey("Id");

                    b.HasIndex("FileNodeId");

                    b.ToTable("Transfers");
                });

            modelBuilder.Entity("Audex.API.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<bool>("Active")
                        .HasColumnType("tinyint(1)");

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("GroupId")
                        .HasColumnType("int");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("PublicKey")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Salt")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("GroupId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Audex.API.Activity", b =>
                {
                    b.HasOne("Audex.API.Device", "Device")
                        .WithMany()
                        .HasForeignKey("DeviceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Audex.API.FileNode", "FileNode")
                        .WithMany()
                        .HasForeignKey("FileNodeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Audex.API.User", "User2")
                        .WithMany()
                        .HasForeignKey("User2Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Audex.API.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Device");

                    b.Navigation("FileNode");

                    b.Navigation("User");

                    b.Navigation("User2");
                });

            modelBuilder.Entity("Audex.API.Device", b =>
                {
                    b.HasOne("Audex.API.DeviceType", "DeviceType")
                        .WithMany("Devices")
                        .HasForeignKey("DeviceTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Audex.API.User", "User")
                        .WithMany("Devices")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("DeviceType");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Audex.API.Drive", b =>
                {
                    b.HasOne("Audex.API.User", "OwnerUser")
                        .WithMany()
                        .HasForeignKey("OwnerUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Audex.API.FileNode", "RootFileNode")
                        .WithMany()
                        .HasForeignKey("RootFileNodeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("OwnerUser");

                    b.Navigation("RootFileNode");
                });

            modelBuilder.Entity("Audex.API.FileNode", b =>
                {
                    b.HasOne("Audex.API.User", "OwnerUser")
                        .WithMany()
                        .HasForeignKey("OwnerUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Audex.API.FileNode", "ParentFileNode")
                        .WithMany("ChildrenFileNodes")
                        .HasForeignKey("ParentFileNodeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Audex.API.Device", "UploadedByDevice")
                        .WithMany()
                        .HasForeignKey("UploadedByDeviceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("OwnerUser");

                    b.Navigation("ParentFileNode");

                    b.Navigation("UploadedByDevice");
                });

            modelBuilder.Entity("Audex.API.GroupRole", b =>
                {
                    b.HasOne("Audex.API.Group", "Group")
                        .WithMany("GroupRoles")
                        .HasForeignKey("GroupId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Audex.API.Role", "Role")
                        .WithMany("GroupRoles")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Group");

                    b.Navigation("Role");
                });

            modelBuilder.Entity("Audex.API.Share", b =>
                {
                    b.HasOne("Audex.API.FileNode", "FileNode")
                        .WithMany()
                        .HasForeignKey("FileNodeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("FileNode");
                });

            modelBuilder.Entity("Audex.API.Transfer", b =>
                {
                    b.HasOne("Audex.API.FileNode", "FileNode")
                        .WithMany()
                        .HasForeignKey("FileNodeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("FileNode");
                });

            modelBuilder.Entity("Audex.API.User", b =>
                {
                    b.HasOne("Audex.API.Group", "Group")
                        .WithMany("Users")
                        .HasForeignKey("GroupId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Group");
                });

            modelBuilder.Entity("Audex.API.DeviceType", b =>
                {
                    b.Navigation("Devices");
                });

            modelBuilder.Entity("Audex.API.FileNode", b =>
                {
                    b.Navigation("ChildrenFileNodes");
                });

            modelBuilder.Entity("Audex.API.Group", b =>
                {
                    b.Navigation("GroupRoles");

                    b.Navigation("Users");
                });

            modelBuilder.Entity("Audex.API.Role", b =>
                {
                    b.Navigation("GroupRoles");
                });

            modelBuilder.Entity("Audex.API.User", b =>
                {
                    b.Navigation("Devices");
                });
#pragma warning restore 612, 618
        }
    }
}