using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Audex.API.Migrations
{
    public partial class DownloadToken : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DownloadTokens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    NumberOfUses = table.Column<int>(type: "int", nullable: false),
                    MaxNumberOfUses = table.Column<int>(type: "int", nullable: false),
                    ExpiresOn = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    FileNodeId = table.Column<Guid>(type: "char(36)", nullable: false),
                    ForUserId = table.Column<Guid>(type: "char(36)", nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DeletedOn = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DownloadTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DownloadTokens_FileNodes_FileNodeId",
                        column: x => x.FileNodeId,
                        principalTable: "FileNodes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DownloadTokens_Users_ForUserId",
                        column: x => x.ForUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DownloadTokens_FileNodeId",
                table: "DownloadTokens",
                column: "FileNodeId");

            migrationBuilder.CreateIndex(
                name: "IX_DownloadTokens_ForUserId",
                table: "DownloadTokens",
                column: "ForUserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DownloadTokens");
        }
    }
}
