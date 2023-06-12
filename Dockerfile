FROM node:18 AS build

USER node
ENV NODE_ENV=development

WORKDIR /app
