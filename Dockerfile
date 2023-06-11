FROM node:18 AS build
WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]
RUN yarn

COPY . .
