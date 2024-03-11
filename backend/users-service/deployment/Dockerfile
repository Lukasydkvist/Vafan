FROM node:latest

# Setup microservice
WORKDIR /Vafan
COPY ./backend/users /Vafan/backend/users
COPY ./backend/common /Vafan/backend/common
COPY ./backend/package.json /Vafan/backend/package.json
COPY ./.env /Vafan/.env
WORKDIR /Vafan/backend/users
RUN npm install

# Start the application
WORKDIR /Vafan
EXPOSE 3002
CMD node backend/users/src/index.js