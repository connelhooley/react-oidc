FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
ARG Configuration=Release

WORKDIR /app

COPY AuthServer.csproj ./

RUN dotnet restore

COPY . ./

RUN dotnet publish -c Release -o /out

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1

WORKDIR /app
# Copy built app
COPY --from=build-env /out ./
ENTRYPOINT ["dotnet", "AuthServer.dll"]