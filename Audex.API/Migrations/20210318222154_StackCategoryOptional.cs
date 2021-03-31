using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Audex.API.Migrations
{
    public partial class StackCategoryOptional : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Stack_StackCategory_StackCategoryId",
                table: "Stack");

            migrationBuilder.AlterColumn<Guid>(
                name: "StackCategoryId",
                table: "Stack",
                type: "char(36)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "char(36)");

            migrationBuilder.AddForeignKey(
                name: "FK_Stack_StackCategory_StackCategoryId",
                table: "Stack",
                column: "StackCategoryId",
                principalTable: "StackCategory",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Stack_StackCategory_StackCategoryId",
                table: "Stack");

            migrationBuilder.AlterColumn<Guid>(
                name: "StackCategoryId",
                table: "Stack",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "char(36)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Stack_StackCategory_StackCategoryId",
                table: "Stack",
                column: "StackCategoryId",
                principalTable: "StackCategory",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
