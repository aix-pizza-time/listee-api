FROM node:12

LABEL maintainer="Alexander Bartolomey"

WORKDIR /

COPY package*.json ./

RUN yarn install

COPY . .

VOLUME [ "/static" ]

ENTRYPOINT [ "bash", "docker-entrypoint.sh" ]