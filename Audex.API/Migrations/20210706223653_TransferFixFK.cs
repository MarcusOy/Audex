using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Audex.API.Migrations
{
    public partial class TransferFixFK : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transfers_Devices_FromDeviceId1_FromDeviceUserId",
                table: "Transfers");

            migrationBuilder.DropForeignKey(
                name: "FK_Transfers_Devices_ToDeviceId1_ToDeviceUserId",
                table: "Transfers");

            migrationBuilder.DropIndex(
                name: "IX_Transfers_FromDeviceId1_FromDeviceUserId",
                table: "Transfers");

            migrationBuilder.DropIndex(
                name: "IX_Transfers_ToDeviceId1_ToDeviceUserId",
                table: "Transfers");

            migrationBuilder.DropColumn(
                name: "FromDeviceId1",
                table: "Transfers");

            migrationBuilder.DropColumn(
                name: "FromDeviceUserId",
                table: "Transfers");

            migrationBuilder.DropColumn(
                name: "ToDeviceId1",
                table: "Transfers");

            migrationBuilder.DropColumn(
                name: "ToDeviceUserId",
                table: "Transfers");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "FromDeviceId1",
                table: "Transfers",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<Guid>(
                name: "FromDeviceUserId",
                table: "Transfers",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<Guid>(
                name: "ToDeviceId1",
                table: "Transfers",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<Guid>(
                name: "ToDeviceUserId",
                table: "Transfers",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_Transfers_FromDeviceId1_FromDeviceUserId",
                table: "Transfers",
                columns: new[] { "FromDeviceId1", "FromDeviceUserId" });

            migrationBuilder.CreateIndex(
                name: "IX_Transfers_ToDeviceId1_ToDeviceUserId",
                table: "Transfers",
                columns: new[] { "ToDeviceId1", "ToDeviceUserId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Transfers_Devices_FromDeviceId1_FromDeviceUserId",
                table: "Transfers",
                columns: new[] { "FromDeviceId1", "FromDeviceUserId" },
                principalTable: "Devices",
                principalColumns: new[] { "Id", "UserId" },
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Transfers_Devices_ToDeviceId1_ToDeviceUserId",
                table: "Transfers",
                columns: new[] { "ToDeviceId1", "ToDeviceUserId" },
                principalTable: "Devices",
                principalColumns: new[] { "Id", "UserId" },
                onDelete: ReferentialAction.Restrict);
        }
    }
}
