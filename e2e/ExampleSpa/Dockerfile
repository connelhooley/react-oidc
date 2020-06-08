FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
ARG Configuration=Release

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . ./

RUN npm run build

FROM nginx:1.17
COPY --from=build-env /app/vhosts.conf /etc/nginx/conf.d/default.conf
COPY --from=build-env /app/build/ /usr/share/nginx/html/
CMD ["nginx", "-g", "daemon off;"]