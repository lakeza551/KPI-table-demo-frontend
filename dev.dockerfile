FROM node:16-alpine

WORKDIR /usr/web/

EXPOSE 3000

CMD ["tail", "-f", "/dev/null"]
