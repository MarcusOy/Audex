using Microsoft.EntityFrameworkCore.Migrations;

namespace Audex.API.Migrations
{
    public partial class AuthTokenDeviceNullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AuthTokens_Devices_DeviceId_UserId",
                table: "AuthTokens");

            migrationBuilder.AddForeignKey(
                name: "FK_AuthTokens_Devices_DeviceId_UserId",
                table: "AuthTokens",
                columns: new[] { "DeviceId", "UserId" },
                principalTable: "Devices",
                principalColumns: new[] { "Id", "UserId" },
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AuthTokens_Devices_DeviceId_UserId",
                table: "AuthTokens");

            migrationBuilder.AddForeignKey(
                name: "FK_AuthTokens_Devices_DeviceId_UserId",
                table: "AuthTokens",
                columns: new[] { "DeviceId", "UserId" },
                principalTable: "Devices",
                principalColumns: new[] { "Id", "UserId" },
                onDelete: ReferentialAction.Cascade);
        }
    }
}
