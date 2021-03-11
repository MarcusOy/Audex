using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Audex.API.Migrations
{
    public partial class Device : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NotificationIdentifier",
                table: "Devices",
                type: "longtext",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeviceId",
                table: "AuthTokens",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_AuthTokens_DeviceId",
                table: "AuthTokens",
                column: "DeviceId");

            migrationBuilder.AddForeignKey(
                name: "FK_AuthTokens_Devices_DeviceId",
                table: "AuthTokens",
                column: "DeviceId",
                principalTable: "Devices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AuthTokens_Devices_DeviceId",
                table: "AuthTokens");

            migrationBuilder.DropIndex(
                name: "IX_AuthTokens_DeviceId",
                table: "AuthTokens");

            migrationBuilder.DropColumn(
                name: "NotificationIdentifier",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "DeviceId",
                table: "AuthTokens");
        }
    }
}
