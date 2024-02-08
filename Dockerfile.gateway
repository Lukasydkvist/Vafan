FROM node:latest

# Set the working directory
WORKDIR /Vafan

# Copy package.json and package-lock.json to the work directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Expose the port that the backend is running on
ENV PORT=3001
EXPOSE 3001

# Start the application
CMD node ./src/Server/gateway/server.js
