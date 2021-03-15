FROM node:14-alpine

WORKDIR /scheduler

COPY package.json ./
COPY package-lock.json ./

RUN npm install

EXPOSE 5001

COPY . .
CMD [ "node", "scheduler.js" ]
