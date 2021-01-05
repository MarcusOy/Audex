using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Audex.API.Migrations
{
    public partial class TransfersAndNullableGUIDFk : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activity_Devices_DeviceId",
                table: "Activity");

            migrationBuilder.DropForeignKey(
                name: "FK_Activity_FileNodes_FileNodeId",
                table: "Activity");

            migrationBuilder.DropForeignKey(
                name: "FK_Activity_Users_User2Id",
                table: "Activity");

            migrationBuilder.DropForeignKey(
                name: "FK_Activity_Users_UserId",
                table: "Activity");

            migrationBuilder.DropForeignKey(
                name: "FK_FileNodes_FileNodes_ParentFileNodeId",
                table: "FileNodes");

            migrationBuilder.AlterColumn<string>(
                name: "PublicKey",
                table: "Users",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext");

            migrationBuilder.AddColumn<Guid>(
                name: "ReceivingDeviceId",
                table: "Transfers",
                type: "char(36)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ReceivingUserId",
                table: "Transfers",
                type: "char(36)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ReceivingrDeviceId",
                table: "Transfers",
                type: "char(36)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SenderDeviceId",
                table: "Transfers",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "SenderUserId",
                table: "Transfers",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AlterColumn<Guid>(
                name: "ParentFileNodeId",
                table: "FileNodes",
                type: "char(36)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "char(36)");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Activity",
                type: "char(36)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "char(36)");

            migrationBuilder.AlterColumn<Guid>(
                name: "User2Id",
                table: "Activity",
                type: "char(36)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "char(36)");

            migrationBuilder.AlterColumn<Guid>(
                name: "FileNodeId",
                table: "Activity",
                type: "char(36)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "char(36)");

            migrationBuilder.AlterColumn<Guid>(
                name: "DeviceId",
                table: "Activity",
                type: "char(36)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "char(36)");

            migrationBuilder.CreateIndex(
                name: "IX_Transfers_ReceivingrDeviceId",
                table: "Transfers",
                column: "ReceivingrDeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_Transfers_ReceivingUserId",
                table: "Transfers",
                column: "ReceivingUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Transfers_SenderDeviceId",
                table: "Transfers",
                column: "SenderDeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_Transfers_SenderUserId",
                table: "Transfers",
                column: "SenderUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Activity_Devices_DeviceId",
                table: "Activity",
                column: "DeviceId",
                principalTable: "Devices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Activity_FileNodes_FileNodeId",
                table: "Activity",
                column: "FileNodeId",
                principalTable: "FileNodes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Activity_Users_User2Id",
                table: "Activity",
                column: "User2Id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Activity_Users_UserId",
                table: "Activity",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_FileNodes_FileNodes_ParentFileNodeId",
                table: "FileNodes",
                column: "ParentFileNodeId",
                principalTable: "FileNodes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Transfers_Devices_ReceivingrDeviceId",
                table: "Transfers",
                column: "ReceivingrDeviceId",
                principalTable: "Devices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Transfers_Devices_SenderDeviceId",
                table: "Transfers",
                column: "SenderDeviceId",
                principalTable: "Devices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Transfers_Users_ReceivingUserId",
                table: "Transfers",
                column: "ReceivingUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Transfers_Users_SenderUserId",
                table: "Transfers",
                column: "SenderUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activity_Devices_DeviceId",
                table: "Activity");

            migrationBuilder.DropForeignKey(
                name: "FK_Activity_FileNodes_FileNodeId",
                table: "Activity");

            migrationBuilder.DropForeignKey(
                name: "FK_Activity_Users_User2Id",
                table: "Activity");

            migrationBuilder.DropForeignKey(
                name: "FK_Activity_Users_UserId",
                table: "Activity");

            migrationBuilder.DropForeignKey(
                name: "FK_FileNodes_FileNodes_ParentFileNodeId",
                table: "FileNodes");

            migrationBuilder.DropForeignKey(
                name: "FK_Transfers_Devices_ReceivingrDeviceId",
                table: "Transfers");

            migrationBuilder.DropForeignKey(
                name: "FK_Transfers_Devices_SenderDeviceId",
                table: "Transfers");

            migrationBuilder.DropForeignKey(
                name: "FK_Transfers_Users_ReceivingUserId",
                table: "Transfers");

            migrationBuilder.DropForeignKey(
                name: "FK_Transfers_Users_SenderUserId",
                table: "Transfers");

            migrationBuilder.DropIndex(
                name: "IX_Transfers_ReceivingrDeviceId",
                table: "Transfers");

            migrationBuilder.DropIndex(
                name: "IX_Transfers_ReceivingUserId",
                table: "Transfers");

            migrationBuilder.DropIndex(
                name: "IX_Transfers_SenderDeviceId",
                table: "Transfers");

            migrationBuilder.DropIndex(
                name: "IX_Transfers_SenderUserId",
                table: "Transfers");

            migrationBuilder.DropColumn(
                name: "ReceivingDeviceId",
                table: "Transfers");

            migrationBuilder.DropColumn(
                name: "ReceivingUserId",
                table: "Transfers");

            migrationBuilder.DropColumn(
                name: "ReceivingrDeviceId",
                table: "Transfers");

            migrationBuilder.DropColumn(
                name: "SenderDeviceId",
                table: "Transfers");

            migrationBuilder.DropColumn(
                name: "SenderUserId",
                table: "Transfers");

            migrationBuilder.AlterColumn<string>(
                name: "PublicKey",
                table: "Users",
                type: "longtext",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "ParentFileNodeId",
                table: "FileNodes",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "char(36)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Activity",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "char(36)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "User2Id",
                table: "Activity",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "char(36)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "FileNodeId",
                table: "Activity",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "char(36)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "DeviceId",
                table: "Activity",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "char(36)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Activity_Devices_DeviceId",
                table: "Activity",
                column: "DeviceId",
                principalTable: "Devices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Activity_FileNodes_FileNodeId",
                table: "Activity",
                column: "FileNodeId",
                principalTable: "FileNodes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Activity_Users_User2Id",
                table: "Activity",
                column: "User2Id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Activity_Users_UserId",
                table: "Activity",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FileNodes_FileNodes_ParentFileNodeId",
                table: "FileNodes",
                column: "ParentFileNodeId",
                principalTable: "FileNodes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
