FROM node:latest

# Setup microservice
WORKDIR /Vafan
COPY ./backend/users-service /Vafan/backend/users-service
COPY ./backend/common /Vafan/backend/common
COPY ./backend/package.json /Vafan/backend/package.json
COPY ./backend/.env /Vafan/.env
WORKDIR /Vafan/backend/users-service
RUN npm install

# Start the application
WORKDIR /Vafan
EXPOSE 3002
CMD node backend/users-service/src/index.js