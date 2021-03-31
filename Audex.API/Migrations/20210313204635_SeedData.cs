using Microsoft.EntityFrameworkCore.Migrations;

namespace Audex.API.Migrations
{
    public partial class SeedData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "DeviceTypes",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Audex Server" },
                    { 2, "Windows" },
                    { 3, "MacOS" },
                    { 4, "Linux" },
                    { 5, "Web" },
                    { 6, "iOS" },
                    { 7, "Android" },
                    { 8, "Other" }
                });

            migrationBuilder.InsertData(
                table: "Groups",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 3, "Viewer" },
                    { 1, "Administrator" },
                    { 2, "Member" }
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 6, "PrivatelyShareFiles" },
                    { 1, "Login" },
                    { 2, "UploadFiles" },
                    { 3, "ViewFiles" },
                    { 4, "UserManagement" },
                    { 5, "DeviceManagement" },
                    { 7, "PubliclyShareFiles" }
                });

            migrationBuilder.InsertData(
                table: "GroupRoles",
                columns: new[] { "Id", "GroupId", "RoleId" },
                values: new object[,]
                {
                    { 1, 1, 1 },
                    { 8, 2, 1 },
                    { 2, 1, 2 },
                    { 9, 2, 2 },
                    { 3, 1, 3 },
                    { 10, 2, 3 },
                    { 4, 1, 4 },
                    { 5, 1, 5 },
                    { 6, 1, 6 },
                    { 11, 2, 6 },
                    { 7, 1, 7 }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "DeviceTypes",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "DeviceTypes",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "DeviceTypes",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "DeviceTypes",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "DeviceTypes",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "DeviceTypes",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "DeviceTypes",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "DeviceTypes",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "GroupRoles",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "GroupRoles",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "GroupRoles",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "GroupRoles",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "GroupRoles",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "GroupRoles",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "GroupRoles",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "GroupRoles",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "GroupRoles",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "GroupRoles",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "GroupRoles",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Groups",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Groups",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Groups",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 7);
        }
    }
}
