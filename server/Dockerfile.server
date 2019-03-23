FROM node:11-alpine

WORKDIR /server

COPY package.json ./
COPY package-lock.json ./

RUN npm install

EXPOSE 5000

CMD [ "node", "server.js" ]
