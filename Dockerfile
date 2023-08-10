FROM node:18 AS development

# Required dependencies to run https://cypress.io
RUN apt-get update
RUN apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb

USER node

WORKDIR /app

FROM node:18 AS build

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

RUN yarn install --immutable --immutable-cache --check-cache

COPY --chown=node:node . .
ARG VITE_BASE_API_URL
RUN yarn vite build

FROM node:18 AS staging

USER node

WORKDIR /app

COPY --chown=node:node --from=build /app/dist dist
COPY --chown=node:node --from=build /app/node_modules node_modules
COPY --chown=node:node --from=build /app/package.json package.json
COPY --chown=node:node .secrets .secrets
COPY --chown=node:node .env .env
COPY --chown=node:node vite.config.ts vite.config.ts

CMD [ "yarn", "preview", "--host"]
