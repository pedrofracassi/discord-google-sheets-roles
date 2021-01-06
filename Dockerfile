FROM node:12 AS builder
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
WORKDIR /src
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm prune --production
RUN /usr/local/bin/node-prune

FROM node:12-alpine
WORKDIR /app
COPY --from=builder /src .
CMD [ "npm", "start" ]