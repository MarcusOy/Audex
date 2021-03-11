using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Audex.API.Migrations
{
    public partial class Stack : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileNodes_FileNodes_ParentFileNodeId",
                table: "FileNodes");

            migrationBuilder.DropTable(
                name: "Drives");

            migrationBuilder.DropColumn(
                name: "ExpiryDate",
                table: "FileNodes");

            migrationBuilder.DropColumn(
                name: "IsDirectory",
                table: "FileNodes");

            migrationBuilder.RenameColumn(
                name: "ParentFileNodeId",
                table: "FileNodes",
                newName: "ParentStackId");

            migrationBuilder.RenameIndex(
                name: "IX_FileNodes_ParentFileNodeId",
                table: "FileNodes",
                newName: "IX_FileNodes_ParentStackId");

            migrationBuilder.CreateTable(
                name: "StackCategory",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Name = table.Column<string>(type: "longtext", nullable: false),
                    Color = table.Column<string>(type: "longtext", nullable: false),
                    OwnerUserId = table.Column<Guid>(type: "char(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StackCategory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StackCategory_Users_OwnerUserId",
                        column: x => x.OwnerUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Stack",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Name = table.Column<string>(type: "longtext", nullable: true),
                    DateCreated = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    StackCategoryId = table.Column<Guid>(type: "char(36)", nullable: false),
                    OwnerUserId = table.Column<Guid>(type: "char(36)", nullable: false),
                    UploadedByDeviceId = table.Column<Guid>(type: "char(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stack", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Stack_Devices_UploadedByDeviceId",
                        column: x => x.UploadedByDeviceId,
                        principalTable: "Devices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Stack_StackCategory_StackCategoryId",
                        column: x => x.StackCategoryId,
                        principalTable: "StackCategory",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Stack_Users_OwnerUserId",
                        column: x => x.OwnerUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Stack_OwnerUserId",
                table: "Stack",
                column: "OwnerUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Stack_StackCategoryId",
                table: "Stack",
                column: "StackCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Stack_UploadedByDeviceId",
                table: "Stack",
                column: "UploadedByDeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_StackCategory_OwnerUserId",
                table: "StackCategory",
                column: "OwnerUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_FileNodes_Stack_ParentStackId",
                table: "FileNodes",
                column: "ParentStackId",
                principalTable: "Stack",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileNodes_Stack_ParentStackId",
                table: "FileNodes");

            migrationBuilder.DropTable(
                name: "Stack");

            migrationBuilder.DropTable(
                name: "StackCategory");

            migrationBuilder.RenameColumn(
                name: "ParentStackId",
                table: "FileNodes",
                newName: "ParentFileNodeId");

            migrationBuilder.RenameIndex(
                name: "IX_FileNodes_ParentStackId",
                table: "FileNodes",
                newName: "IX_FileNodes_ParentFileNodeId");

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiryDate",
                table: "FileNodes",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDirectory",
                table: "FileNodes",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

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

            migrationBuilder.AddForeignKey(
                name: "FK_FileNodes_FileNodes_ParentFileNodeId",
                table: "FileNodes",
                column: "ParentFileNodeId",
                principalTable: "FileNodes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
