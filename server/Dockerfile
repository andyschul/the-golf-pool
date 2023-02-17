FROM node:14-alpine

WORKDIR /server

COPY package.json ./
COPY package-lock.json ./

RUN npm install

EXPOSE 5000

COPY . .
CMD [ "node", "server.js" ]
