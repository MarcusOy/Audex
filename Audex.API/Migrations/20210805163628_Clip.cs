using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Audex.API.Migrations
{
    public partial class Clip : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transfers_Stack_StackId",
                table: "Transfers");

            migrationBuilder.AlterColumn<Guid>(
                name: "StackId",
                table: "Transfers",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)")
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.AddColumn<Guid>(
                name: "ClipId",
                table: "Transfers",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateTable(
                name: "Clips",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Content = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsSecured = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    OwnerUserId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    UploadedByDeviceId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    CreatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DeletedOn = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clips", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Clips_Devices_UploadedByDeviceId_OwnerUserId",
                        columns: x => new { x.UploadedByDeviceId, x.OwnerUserId },
                        principalTable: "Devices",
                        principalColumns: new[] { "Id", "UserId" },
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Clips_Users_OwnerUserId",
                        column: x => x.OwnerUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Transfers_ClipId",
                table: "Transfers",
                column: "ClipId");

            migrationBuilder.CreateIndex(
                name: "IX_Clips_OwnerUserId",
                table: "Clips",
                column: "OwnerUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Clips_UploadedByDeviceId_OwnerUserId",
                table: "Clips",
                columns: new[] { "UploadedByDeviceId", "OwnerUserId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Transfers_Clips_ClipId",
                table: "Transfers",
                column: "ClipId",
                principalTable: "Clips",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Transfers_Stack_StackId",
                table: "Transfers",
                column: "StackId",
                principalTable: "Stack",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transfers_Clips_ClipId",
                table: "Transfers");

            migrationBuilder.DropForeignKey(
                name: "FK_Transfers_Stack_StackId",
                table: "Transfers");

            migrationBuilder.DropTable(
                name: "Clips");

            migrationBuilder.DropIndex(
                name: "IX_Transfers_ClipId",
                table: "Transfers");

            migrationBuilder.DropColumn(
                name: "ClipId",
                table: "Transfers");

            migrationBuilder.AlterColumn<Guid>(
                name: "StackId",
                table: "Transfers",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)",
                oldNullable: true)
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.AddForeignKey(
                name: "FK_Transfers_Stack_StackId",
                table: "Transfers",
                column: "StackId",
                principalTable: "Stack",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
