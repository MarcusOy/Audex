using Microsoft.EntityFrameworkCore.Migrations;

namespace Audex.API.Migrations
{
    public partial class StacksRename : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileNodes_Stack_ParentStackId",
                table: "FileNodes");

            migrationBuilder.DropForeignKey(
                name: "FK_Stack_Devices_UploadedByDeviceId_OwnerUserId",
                table: "Stack");

            migrationBuilder.DropForeignKey(
                name: "FK_Stack_StackCategory_StackCategoryId",
                table: "Stack");

            migrationBuilder.DropForeignKey(
                name: "FK_Stack_Users_OwnerUserId",
                table: "Stack");

            migrationBuilder.DropForeignKey(
                name: "FK_StackCategory_Users_OwnerUserId",
                table: "StackCategory");

            migrationBuilder.DropForeignKey(
                name: "FK_Transfers_Stack_StackId",
                table: "Transfers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StackCategory",
                table: "StackCategory");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Stack",
                table: "Stack");

            migrationBuilder.RenameTable(
                name: "StackCategory",
                newName: "StackCategories");

            migrationBuilder.RenameTable(
                name: "Stack",
                newName: "Stacks");

            migrationBuilder.RenameIndex(
                name: "IX_StackCategory_OwnerUserId",
                table: "StackCategories",
                newName: "IX_StackCategories_OwnerUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Stack_UploadedByDeviceId_OwnerUserId",
                table: "Stacks",
                newName: "IX_Stacks_UploadedByDeviceId_OwnerUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Stack_StackCategoryId",
                table: "Stacks",
                newName: "IX_Stacks_StackCategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Stack_OwnerUserId",
                table: "Stacks",
                newName: "IX_Stacks_OwnerUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StackCategories",
                table: "StackCategories",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Stacks",
                table: "Stacks",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FileNodes_Stacks_ParentStackId",
                table: "FileNodes",
                column: "ParentStackId",
                principalTable: "Stacks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StackCategories_Users_OwnerUserId",
                table: "StackCategories",
                column: "OwnerUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Stacks_Devices_UploadedByDeviceId_OwnerUserId",
                table: "Stacks",
                columns: new[] { "UploadedByDeviceId", "OwnerUserId" },
                principalTable: "Devices",
                principalColumns: new[] { "Id", "UserId" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Stacks_StackCategories_StackCategoryId",
                table: "Stacks",
                column: "StackCategoryId",
                principalTable: "StackCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Stacks_Users_OwnerUserId",
                table: "Stacks",
                column: "OwnerUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Transfers_Stacks_StackId",
                table: "Transfers",
                column: "StackId",
                principalTable: "Stacks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileNodes_Stacks_ParentStackId",
                table: "FileNodes");

            migrationBuilder.DropForeignKey(
                name: "FK_StackCategories_Users_OwnerUserId",
                table: "StackCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_Stacks_Devices_UploadedByDeviceId_OwnerUserId",
                table: "Stacks");

            migrationBuilder.DropForeignKey(
                name: "FK_Stacks_StackCategories_StackCategoryId",
                table: "Stacks");

            migrationBuilder.DropForeignKey(
                name: "FK_Stacks_Users_OwnerUserId",
                table: "Stacks");

            migrationBuilder.DropForeignKey(
                name: "FK_Transfers_Stacks_StackId",
                table: "Transfers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Stacks",
                table: "Stacks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StackCategories",
                table: "StackCategories");

            migrationBuilder.RenameTable(
                name: "Stacks",
                newName: "Stack");

            migrationBuilder.RenameTable(
                name: "StackCategories",
                newName: "StackCategory");

            migrationBuilder.RenameIndex(
                name: "IX_Stacks_UploadedByDeviceId_OwnerUserId",
                table: "Stack",
                newName: "IX_Stack_UploadedByDeviceId_OwnerUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Stacks_StackCategoryId",
                table: "Stack",
                newName: "IX_Stack_StackCategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Stacks_OwnerUserId",
                table: "Stack",
                newName: "IX_Stack_OwnerUserId");

            migrationBuilder.RenameIndex(
                name: "IX_StackCategories_OwnerUserId",
                table: "StackCategory",
                newName: "IX_StackCategory_OwnerUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Stack",
                table: "Stack",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StackCategory",
                table: "StackCategory",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FileNodes_Stack_ParentStackId",
                table: "FileNodes",
                column: "ParentStackId",
                principalTable: "Stack",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Stack_Devices_UploadedByDeviceId_OwnerUserId",
                table: "Stack",
                columns: new[] { "UploadedByDeviceId", "OwnerUserId" },
                principalTable: "Devices",
                principalColumns: new[] { "Id", "UserId" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Stack_StackCategory_StackCategoryId",
                table: "Stack",
                column: "StackCategoryId",
                principalTable: "StackCategory",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Stack_Users_OwnerUserId",
                table: "Stack",
                column: "OwnerUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StackCategory_Users_OwnerUserId",
                table: "StackCategory",
                column: "OwnerUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Transfers_Stack_StackId",
                table: "Transfers",
                column: "StackId",
                principalTable: "Stack",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
