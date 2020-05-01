FROM node:14 as builder
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx nx build api
RUN npm run migration:up

FROM node:14
WORKDIR /usr/app
COPY --from=builder /usr/app/dist ./dist/api

EXPOSE 3333
CMD node dist/main.js
