##### Stage 1: Build API
FROM node:24-alpine AS api-builder

WORKDIR /build

# Copy API package files and install dependencies
COPY ./api/package*.json ./
RUN npm install

# Copy API source and build
COPY ./api ./
RUN npm run build

##### Stage 2: Build frontend assets
FROM node:24-alpine AS frontend-builder

WORKDIR /build/api

# Copy API schemas first (needed for TypeScript imports in frontend)
COPY --from=api-builder /build/src/schema ./src/schema
COPY --from=api-builder /build/dist/schema ./dist/schema
COPY ./api/package*.json ./
RUN npm install

# Copy frontend package files and install dependencies
WORKDIR /build/app

COPY ./app/package*.json ./
RUN npm install

# Copy frontend source and build
COPY ./app ./
RUN npm run build

##### Stage 3: Production runtime
FROM node:24-alpine

# Declare built-time ARG with a default
ARG PORT=80
ENV PORT=${PORT}

# Copy built frontend assets to public directory
WORKDIR /
COPY --from=frontend-builder /build/public ./public

# Copy only production dependencies for API
WORKDIR /app

COPY ./api/package*.json ./
RUN npm install --omit=dev

# Copy built API from builder
COPY --from=api-builder /build/dist ./

# Expose the port your app runs on
EXPOSE ${PORT}

# Start the Node.js server
WORKDIR /app
CMD ["npm", "start"]