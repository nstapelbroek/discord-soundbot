# Base will install runtime dependencies and configure generics
FROM node:14-slim as base
LABEL maintainer="Marko Kajzer <markokajzer91@gmail.com>, Nico Stapelbroek <discord-soundbot@nstapelbroek.com>"

RUN apt-get update -q && apt-get install -qy wget
RUN wget -qO /tini https://github.com/krallin/tini/releases/download/v0.18.0/tini-$(dpkg --print-architecture) && \
    chmod +x /tini && mkdir /app && chown -R node:node /app

WORKDIR /app


# Builder will install system dependencies
FROM base as builder
RUN apt-get update -q && apt-get install -qy python make g++ tar xz-utils
RUN wget -qO /tmp/ffmpeg.tar.xz https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-$(dpkg --print-architecture)-static.tar.xz && \
    tar -x -C /usr/local/bin --strip-components 1 -f /tmp/ffmpeg.tar.xz --wildcards '*/ffmpeg' && rm /tmp/ffmpeg.tar.xz


# Build will compile ts to js
FROM builder AS build
USER node
COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-optional

COPY . /app
RUN yarn build
RUN yarn install --frozen-lockfile --production --ignore-optional && yarn cache clean --force


# release has the bare minimum to run the application
FROM base as release
ENV NODE_ENV=production \
    SENTRY_DSN=https://c4c3dce19407466db31cfb5c9be7d3f4@sentry.io/1887279
COPY --chown=node:node --from=build /usr/local/bin/ffmpeg /usr/local/bin/ffmpeg
COPY --chown=node:node --from=build /app/storage ./storage
COPY --chown=node:node --from=build /app/locale ./locale
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist

USER node
ENTRYPOINT ["/tini", "--"]
CMD ["node", "./dist/bin/soundbot.js"]
