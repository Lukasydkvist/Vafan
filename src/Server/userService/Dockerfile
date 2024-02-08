FROM node:latest

# Set the working directory
WORKDIR /Vafan

# Copy package.json and package-lock.json to the work directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the backend is running on
ENV PORT=3002
EXPOSE 3002

# Start the application
CMD node ./src/Server/userService/server.js