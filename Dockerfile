FROM node:12-alpine

LABEL maintainer="Alexander Bartolomey <occloxium@gmail.com>"

WORKDIR /

COPY package*.json ./

RUN yarn install

COPY . .

VOLUME [ "/static" ]

ENTRYPOINT [ "yarn", "start" ]