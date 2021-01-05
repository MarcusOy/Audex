using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Audex.API.Migrations
{
    public partial class AddFileNode : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FileExtensions");

            migrationBuilder.DropTable(
                name: "Files");

            migrationBuilder.DropTable(
                name: "FilesTypes");

            migrationBuilder.AddColumn<string>(
                name: "PublicKey",
                table: "Users",
                type: "longtext",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "FileNodes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    IsDirectory = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Name = table.Column<string>(type: "longtext", nullable: false),
                    FileExtension = table.Column<string>(type: "longtext", nullable: true),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    OwnerUserId = table.Column<Guid>(type: "char(36)", nullable: false),
                    UploadedByDeviceId = table.Column<Guid>(type: "char(36)", nullable: true),
                    ParentFileNodeId = table.Column<Guid>(type: "char(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FileNodes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FileNodes_Devices_UploadedByDeviceId",
                        column: x => x.UploadedByDeviceId,
                        principalTable: "Devices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FileNodes_FileNodes_ParentFileNodeId",
                        column: x => x.ParentFileNodeId,
                        principalTable: "FileNodes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FileNodes_Users_OwnerUserId",
                        column: x => x.OwnerUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Activity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Message = table.Column<string>(type: "longtext", nullable: true),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false),
                    User2Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    DeviceId = table.Column<Guid>(type: "char(36)", nullable: false),
                    FileNodeId = table.Column<Guid>(type: "char(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Activity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Activity_Devices_DeviceId",
                        column: x => x.DeviceId,
                        principalTable: "Devices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Activity_FileNodes_FileNodeId",
                        column: x => x.FileNodeId,
                        principalTable: "FileNodes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Activity_Users_User2Id",
                        column: x => x.User2Id,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Activity_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Shares",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    UrlExtension = table.Column<string>(type: "longtext", nullable: true),
                    PIN = table.Column<int>(type: "int", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    FileNodeId = table.Column<Guid>(type: "char(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shares", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Shares_FileNodes_FileNodeId",
                        column: x => x.FileNodeId,
                        principalTable: "FileNodes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Transfers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    FileNodeId = table.Column<Guid>(type: "char(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transfers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Transfers_FileNodes_FileNodeId",
                        column: x => x.FileNodeId,
                        principalTable: "FileNodes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Activity_DeviceId",
                table: "Activity",
                column: "DeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_Activity_FileNodeId",
                table: "Activity",
                column: "FileNodeId");

            migrationBuilder.CreateIndex(
                name: "IX_Activity_User2Id",
                table: "Activity",
                column: "User2Id");

            migrationBuilder.CreateIndex(
                name: "IX_Activity_UserId",
                table: "Activity",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_FileNodes_OwnerUserId",
                table: "FileNodes",
                column: "OwnerUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FileNodes_ParentFileNodeId",
                table: "FileNodes",
                column: "ParentFileNodeId");

            migrationBuilder.CreateIndex(
                name: "IX_FileNodes_UploadedByDeviceId",
                table: "FileNodes",
                column: "UploadedByDeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_Shares_FileNodeId",
                table: "Shares",
                column: "FileNodeId");

            migrationBuilder.CreateIndex(
                name: "IX_Transfers_FileNodeId",
                table: "Transfers",
                column: "FileNodeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Activity");

            migrationBuilder.DropTable(
                name: "Shares");

            migrationBuilder.DropTable(
                name: "Transfers");

            migrationBuilder.DropTable(
                name: "FileNodes");

            migrationBuilder.DropColumn(
                name: "PublicKey",
                table: "Users");

            migrationBuilder.CreateTable(
                name: "FilesTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FilesTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FileExtensions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    FileTypeId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FileExtensions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FileExtensions_FilesTypes_FileTypeId",
                        column: x => x.FileTypeId,
                        principalTable: "FilesTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Files",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    DateUploaded = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    FileName = table.Column<string>(type: "longtext", nullable: false),
                    FileTypeId = table.Column<int>(type: "int", nullable: false),
                    IsPersistant = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    OriginalPersistantPath = table.Column<string>(type: "longtext", nullable: true),
                    RecipientDeviceId = table.Column<Guid>(type: "char(36)", nullable: false),
                    UploadedByDeviceId = table.Column<Guid>(type: "char(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Files", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Files_Devices_RecipientDeviceId",
                        column: x => x.RecipientDeviceId,
                        principalTable: "Devices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Files_Devices_UploadedByDeviceId",
                        column: x => x.UploadedByDeviceId,
                        principalTable: "Devices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Files_FilesTypes_FileTypeId",
                        column: x => x.FileTypeId,
                        principalTable: "FilesTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FileExtensions_FileTypeId",
                table: "FileExtensions",
                column: "FileTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Files_FileTypeId",
                table: "Files",
                column: "FileTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Files_RecipientDeviceId",
                table: "Files",
                column: "RecipientDeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_Files_UploadedByDeviceId",
                table: "Files",
                column: "UploadedByDeviceId");
        }
    }
}
