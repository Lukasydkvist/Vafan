FROM node:latest

# Setup microservice
WORKDIR /Vafan
COPY ./backend/meetings /Vafan/backend/meetings
COPY ./backend/common /Vafan/backend/common
COPY ./backend/package.json /Vafan/backend/package.json
COPY ./.env /Vafan/.env
WORKDIR /Vafan/backend/meetings
RUN npm install

# Start the application
WORKDIR /Vafan
EXPOSE 3003
CMD node backend/meetings/src/index.js