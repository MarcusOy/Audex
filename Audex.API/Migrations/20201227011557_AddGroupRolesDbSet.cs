using Microsoft.EntityFrameworkCore.Migrations;

namespace Audex.API.Migrations
{
    public partial class AddGroupRolesDbSet : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupRole_Groups_GroupId",
                table: "GroupRole");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupRole_Role_RoleId",
                table: "GroupRole");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Role",
                table: "Role");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GroupRole",
                table: "GroupRole");

            migrationBuilder.RenameTable(
                name: "Role",
                newName: "Roles");

            migrationBuilder.RenameTable(
                name: "GroupRole",
                newName: "GroupRoles");

            migrationBuilder.RenameIndex(
                name: "IX_GroupRole_RoleId",
                table: "GroupRoles",
                newName: "IX_GroupRoles_RoleId");

            migrationBuilder.RenameIndex(
                name: "IX_GroupRole_GroupId",
                table: "GroupRoles",
                newName: "IX_GroupRoles_GroupId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Roles",
                table: "Roles",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GroupRoles",
                table: "GroupRoles",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupRoles_Groups_GroupId",
                table: "GroupRoles",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupRoles_Roles_RoleId",
                table: "GroupRoles",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GroupRoles_Groups_GroupId",
                table: "GroupRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupRoles_Roles_RoleId",
                table: "GroupRoles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Roles",
                table: "Roles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_GroupRoles",
                table: "GroupRoles");

            migrationBuilder.RenameTable(
                name: "Roles",
                newName: "Role");

            migrationBuilder.RenameTable(
                name: "GroupRoles",
                newName: "GroupRole");

            migrationBuilder.RenameIndex(
                name: "IX_GroupRoles_RoleId",
                table: "GroupRole",
                newName: "IX_GroupRole_RoleId");

            migrationBuilder.RenameIndex(
                name: "IX_GroupRoles_GroupId",
                table: "GroupRole",
                newName: "IX_GroupRole_GroupId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Role",
                table: "Role",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GroupRole",
                table: "GroupRole",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_GroupRole_Groups_GroupId",
                table: "GroupRole",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupRole_Role_RoleId",
                table: "GroupRole",
                column: "RoleId",
                principalTable: "Role",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
