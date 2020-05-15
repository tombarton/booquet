# @TODO: Complete the Dockerfile. We're not doing anything useful for production here
# yet as we've had issues packaging the application up when we start generating GraphQL
# schemas in a code-first approach.

FROM node:12

# Create app directory
WORKDIR /app

# Inject the PRISMA DB URL so it can be generated in the client.
ARG PRISMA_DB_URL
ENV PRISMA_DB_URL "$PRISMA_DB_URL"

RUN npm install -g @prisma/cli --unsafe-perm

COPY ./prisma/schema.prisma ./
COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY tsconfig*.json ./
COPY src ./src

ENV DEBUG=*

CMD ["yarn", "start:dev"]
