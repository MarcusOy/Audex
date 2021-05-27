<div align="center">
    <img src="../Audex.png">

    A file storage server with features inspired by Apple's ecosystem.

</div>

# Introduction

This project is a work-in-progress. Check back later.

# Table of Contents

To be done.

## Features

To be done.

## Running the Project

To run this project, Docker is recommended, however, the project can be run as a standalone dotnet service

### Docker

To be done.

### Dotnet

To be done.

## Developing and Contributing

To modify this project, follow these steps to get this project working:

1. Clone repository and `cd` into repo folder.
2. `cd Audex.API/` to switch to the API folder.
3. `dotnet watch run` to start a dotnet development server with hot-reloading on. Alternatively, exclude the `watch` argument to run without hot-reloading.

### EF Migrations

This project uses Entity Framework for communication between the MySQL server. Migrations are files that represent changes to the database schema. Heres a quick primer on how to do migrations:

0. Make sure to have the `dotnet-ef` tool installed. You can install it by using the command `dotnet tool install --global dotnet-ef`.
1. Create a change to a model in the `AudexDBContext.cs` file.
2. `dotnet ef migrations add *Descriptive Name of Change*` will create a new migration file in the `./Migration` folder.
3. `dotnet ef database update` will apply any new migrations that have not been applied to the database already. Alternatively, you can start the application since migrations are applied on application start.

[More information on Entity Framework Migrations](https://docs.microsoft.com/en-us/ef/core/managing-schemas/migrations/?tabs=dotnet-core-cli)

## Attributions

To be done.
