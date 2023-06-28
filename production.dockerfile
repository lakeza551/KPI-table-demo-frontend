FROM node:16-alpine

WORKDIR /usr/web/

ADD . /usr/web/

RUN npm i

EXPOSE 3000

CMD ["node", "app.js"]
