FROM node:13.6
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY . .
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
ENV CI=true
ENTRYPOINT [ "npm", "start" ]