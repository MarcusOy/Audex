using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Audex.API.Migrations
{
    public partial class BaseEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DateCreated",
                table: "Users",
                newName: "UpdatedOn");

            migrationBuilder.RenameColumn(
                name: "DateCreated",
                table: "Stack",
                newName: "UpdatedOn");

            migrationBuilder.RenameColumn(
                name: "DateCreated",
                table: "FileNodes",
                newName: "UpdatedOn");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "Users",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "Transfers",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedOn",
                table: "Transfers",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "StackCategory",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedOn",
                table: "StackCategory",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "Stack",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "Shares",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedOn",
                table: "Shares",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "Roles",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedOn",
                table: "Roles",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "Groups",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedOn",
                table: "Groups",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "GroupRoles",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedOn",
                table: "GroupRoles",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "FileNodes",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "DeviceTypes",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedOn",
                table: "DeviceTypes",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "Devices",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedOn",
                table: "Devices",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedOn",
                table: "AuthTokens",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "Activity",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedOn",
                table: "Activity",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "Transfers");

            migrationBuilder.DropColumn(
                name: "UpdatedOn",
                table: "Transfers");

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "StackCategory");

            migrationBuilder.DropColumn(
                name: "UpdatedOn",
                table: "StackCategory");

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "Stack");

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "Shares");

            migrationBuilder.DropColumn(
                name: "UpdatedOn",
                table: "Shares");

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "UpdatedOn",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "UpdatedOn",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "GroupRoles");

            migrationBuilder.DropColumn(
                name: "UpdatedOn",
                table: "GroupRoles");

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "FileNodes");

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "DeviceTypes");

            migrationBuilder.DropColumn(
                name: "UpdatedOn",
                table: "DeviceTypes");

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "UpdatedOn",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "UpdatedOn",
                table: "AuthTokens");

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "Activity");

            migrationBuilder.DropColumn(
                name: "UpdatedOn",
                table: "Activity");

            migrationBuilder.RenameColumn(
                name: "UpdatedOn",
                table: "Users",
                newName: "DateCreated");

            migrationBuilder.RenameColumn(
                name: "UpdatedOn",
                table: "Stack",
                newName: "DateCreated");

            migrationBuilder.RenameColumn(
                name: "UpdatedOn",
                table: "FileNodes",
                newName: "DateCreated");
        }
    }
}
