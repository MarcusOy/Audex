using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Audex.API.Migrations
{
    public partial class AuthTokenNullableReplacement : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AuthTokens_AuthTokens_ReplacedByTokenId",
                table: "AuthTokens");

            migrationBuilder.AlterColumn<Guid>(
                name: "ReplacedByTokenId",
                table: "AuthTokens",
                type: "char(36)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "char(36)");

            migrationBuilder.AddForeignKey(
                name: "FK_AuthTokens_AuthTokens_ReplacedByTokenId",
                table: "AuthTokens",
                column: "ReplacedByTokenId",
                principalTable: "AuthTokens",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AuthTokens_AuthTokens_ReplacedByTokenId",
                table: "AuthTokens");

            migrationBuilder.AlterColumn<Guid>(
                name: "ReplacedByTokenId",
                table: "AuthTokens",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "char(36)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AuthTokens_AuthTokens_ReplacedByTokenId",
                table: "AuthTokens",
                column: "ReplacedByTokenId",
                principalTable: "AuthTokens",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
