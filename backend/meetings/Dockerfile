FROM node:latest

# Setup microservice
WORKDIR /Vafan
COPY ./backend/meetings /Vafan/backend/meetings
COPY ./backend/package.json /Vafan/backend/package.json
COPY ./backend/*.js /Vafan/backend/
WORKDIR /Vafan/backend
RUN npm install

# Start the application
EXPOSE 3003
WORKDIR /Vafan
CMD node backend/meetings/src/index.js