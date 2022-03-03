FROM python:3-alpine as python
FROM node:16-alpine

RUN apk add --no-cache expat make g++

COPY --from=python /usr/local/bin /usr/local/bin
COPY --from=python /usr/local/lib /usr/local/lib
COPY --from=python /usr/local/include /usr/local/include

USER node
WORKDIR /home/node
RUN mkdir app && mkdir app/node_modules
