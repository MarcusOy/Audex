using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Audex.API.Migrations
{
    public partial class AddDrives : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Drives",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    OwnerUserId = table.Column<Guid>(type: "char(36)", nullable: false),
                    RootFileNodeId = table.Column<Guid>(type: "char(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Drives", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Drives_FileNodes_RootFileNodeId",
                        column: x => x.RootFileNodeId,
                        principalTable: "FileNodes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Drives_Users_OwnerUserId",
                        column: x => x.OwnerUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Drives_OwnerUserId",
                table: "Drives",
                column: "OwnerUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Drives_RootFileNodeId",
                table: "Drives",
                column: "RootFileNodeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Drives");
        }
    }
}
