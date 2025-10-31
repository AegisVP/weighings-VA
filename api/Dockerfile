# Use official Node.js LTS image
FROM node:24-alpine

# Declare built-time ARG with a default
ARG API_PORT=8080
ENV API_PORT=${API_PORT}

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY ./package*.json ./
RUN npm install

# Copy the rest of the application code
COPY ./ ./
RUN npm run build

# Expose the port your app runs on (change if needed)
EXPOSE ${API_PORT}

# Start the Node.js server
CMD ["npm", "start"]