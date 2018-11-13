# TODO: This could probably be removed once we move to D3 V5
# FROM gcc:8.2.0 as builder-a
# COPY d3-v3 .
# WORKDIR /d3-v3
# RUN npm install

# build environment
FROM nikolaik/python-nodejs:latest as builder
#FROM node:10-alpine as builder
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
COPY . /usr/src/app

RUN npm install
RUN npm run build

FROM nginx:1.13.9-alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
# Use customer nginx configuration to handle nested route forwarding
COPY config/nginx/default.conf /etc/nginx/conf.d/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
