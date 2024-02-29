FROM node:latest

# Setup gateway
WORKDIR /Vafan
COPY ./backend/gateway /Vafan/backend/gateway
COPY ./backend/package.json /Vafan/backend/package.json
COPY ./backend/*.js /Vafan/backend/
WORKDIR /Vafan/backend
RUN npm install

# Setup static client files
WORKDIR /Vafan
COPY ./frontend /Vafan/frontend
WORKDIR /Vafan/frontend
RUN npm install
RUN npm run build

# Start the application
EXPOSE 3001
WORKDIR /Vafan
CMD node backend/gateway/src/index.js