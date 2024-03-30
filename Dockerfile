# FROM node:20-alpine AS base

# LABEL maintainer="Bingqi Liu"

# ENV NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production YARN_VERSION=4.0.1

# RUN apk update && apk upgrade && apk add --no-cache libc6-compat && apk add dumb-init

# RUN corepack enable && corepack prepare yarn@${YARN_VERSION}

# # Install dependencies only when needed
# FROM base AS builder
# WORKDIR /app

# COPY package.json .
# COPY yarn.lock .

# RUN yarn install --immutable

# COPY . .

# EXPOSE 3000

# CMD ["yarn", "start"]

FROM node:18.16.0-alpine3.17
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start"]