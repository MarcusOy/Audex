# FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS base
# WORKDIR /app
# # EXPOSE 80 
# # EXPOSE 443
# RUN curl -sL https://deb.nodesource.com/setup_10.x |  bash -
# RUN apt-get install -y nodejs

# FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
# RUN curl -sL https://deb.nodesource.com/setup_10.x |  bash -
# RUN apt-get install -y nodejs
# WORKDIR /src
# COPY ["LocorumBackend.Landing/LocorumBackend.Landing.csproj", "LocorumBackend.Landing/"]
# RUN dotnet restore "LocorumBackend.Landing/WebApplication37.csproj"
# COPY . .
# WORKDIR "/src/LocorumBackend.Landing"
# RUN dotnet build "LocorumBackend.Landing.csproj" -c Release -o /app

# FROM build AS publish
# RUN dotnet publish "LocorumBackend.Landing.csproj" -c Release -o /app

# FROM base AS final
# WORKDIR /app
# COPY --from=publish /app .
# ENTRYPOINT ["dotnet", "LocorumBackend.Landing.dll"]


FROM mcr.microsoft.com/dotnet/core/sdk:3.1

WORKDIR /vsdbg

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    unzip \
    && rm -rf /var/lib/apt/lists/* \
    && curl -sSL https://aka.ms/getvsdbgsh \
    | bash /dev/stdin -v latest -l /vsdbg

ENV DOTNET_USE_POLLING_FILE_WATCHER 1
ENV DOTNET_CLI_TELEMETRY_OPTOUT 1

WORKDIR /app
# RUN curl -sL https://deb.nodesource.com/setup_10.x |  bash -
# RUN apt-get install -y nodejs

ENTRYPOINT dotnet watch run --urls=http://*:81