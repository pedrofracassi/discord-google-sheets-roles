FROM node:12 AS builder
WORKDIR /src
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm prune --production

FROM node:12-alpine
WORKDIR /app
COPY --from=builder /src .
CMD [ "npm", "start" ]