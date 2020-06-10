Push-Location ".."
npm run build
npm link
Pop-Location

npm link "@connelhooley/react-oidc"
docker-compose up --build --detach
dotnet test "./Tests/Tests.csproj"
docker-compose --file "docker-compose.yml" down