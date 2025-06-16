FROM node:16-alpine

WORKDIR /usr/web/

ADD ./package.json .

RUN npm i

EXPOSE 3000

