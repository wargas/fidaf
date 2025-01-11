# syntax=docker/dockerfile:1

FROM oven/bun as build

ENV TZ UTC

WORKDIR /usr/src/app

COPY . .

RUN bun install

CMD [ "bun", "cron.ts" ]

