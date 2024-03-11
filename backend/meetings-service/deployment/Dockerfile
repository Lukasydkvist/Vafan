FROM node:latest

# Setup microservice
WORKDIR /Vafan
COPY ./backend/meetings-service /Vafan/backend/meetings-service
COPY ./backend/common /Vafan/backend/common
COPY ./backend/package.json /Vafan/backend/package.json
WORKDIR /Vafan/backend/meetings-service
RUN npm install

# Start the application
WORKDIR /Vafan
EXPOSE 3003
CMD node backend/meetings-service/src/index.js