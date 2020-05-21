# Base image is hosted on Docker Hub but can be adjusted by editing Dockerfile.base
FROM booquet/base:latest as build

# Create app directory
WORKDIR /app

# Inject the PRISMA DB URL so it can be generated in the client.
ARG PRISMA_DB_URL
ENV PRISMA_DB_URL "$PRISMA_DB_URL"

# Install Prisma Global CLI.
RUN npm install -g @prisma/cli --unsafe-perm

# Copy over pre-dependency items.
COPY ./prisma/schema.prisma ./
COPY package.json ./
COPY yarn.lock ./

# Install dependencies.
RUN yarn

# Copy over everything else.
COPY tsconfig*.json ./
COPY src ./src

RUN npx tsc --showConfig

# Build production.
RUN yarn build


# Remove dev dependencies.
RUN npm prune --production

# Remove any other unnecessary files.
RUN /usr/local/bin/node-prune

# Production
FROM node:14-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy over dependencies and build
COPY --from=build /app/package.json ./
COPY --from=build /app/yarn.lock ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD ["yarn", "start:prod"]
