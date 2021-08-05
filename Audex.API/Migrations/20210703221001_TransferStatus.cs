using Microsoft.EntityFrameworkCore.Migrations;

namespace Audex.API.Migrations
{
    public partial class TransferStatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsComplete",
                table: "Transfers");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Transfers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Transfers");

            migrationBuilder.AddColumn<bool>(
                name: "IsComplete",
                table: "Transfers",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }
    }
}
