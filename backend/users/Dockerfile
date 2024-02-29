FROM node:latest

# Setup microservice
WORKDIR /Vafan
COPY ./backend/users /Vafan/backend/users
COPY ./backend/package.json /Vafan/backend/package.json
COPY ./backend/*.js /Vafan/backend/
WORKDIR /Vafan/backend
RUN npm install

# Start the application
EXPOSE 3002
WORKDIR /Vafan
CMD node backend/users/src/index.js