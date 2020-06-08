docker-compose --file "docker-compose.yml" up --build --detach
dotnet test "./Tests/Tests.csproj"
docker-compose --file "docker-compose.yml" down