FROM node:10.10.0-alpine AS build-env

ARG ARG_REACT_APP_SITE_TITLE
ARG ARG_REACT_APP_API_URL
ARG ARG_REACT_APP_DEFAULT_LOCALE
ARG ARG_REACT_APP_APP_VERSION

ENV REACT_APP_SITE_TITLE=$ARG_REACT_APP_SITE_TITLE
ENV REACT_APP_API_URL=$ARG_REACT_APP_API_URL
ENV REACT_APP_DEFAULT_LOCALE=$ARG_REACT_APP_DEFAULT_LOCALE
ENV REACT_APP_APP_VERSION=$ARG_REACT_APP_APP_VERSION

WORKDIR /usr/src/app
# Copy package.json and restore as distinct layers
COPY package.json yarn.lock ./
RUN yarn
# Copy everything else and build
COPY . .
RUN yarn build

# Build runtime image
FROM nginx:1.13.9-alpine

# Add new config
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx
RUN ls
COPY --from=build-env /usr/src/app/build /usr/share/nginx/html