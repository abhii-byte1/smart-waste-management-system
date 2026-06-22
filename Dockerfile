# Stage 1: Build the frontend
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm install
RUN npm install --prefix backend
RUN npm install --prefix frontend --include=dev

# Copy source code
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY server.js ./

# Build frontend static files
RUN npm run build --prefix frontend

# Stage 2: Run the production server
FROM node:20-alpine
WORKDIR /app

# Copy production packages and install only production dependencies
COPY package*.json ./
COPY backend/package*.json ./backend/
RUN npm install --only=production
RUN npm install --prefix backend --omit=dev

# Copy backend files and the root server
COPY backend/ ./backend/
COPY server.js ./

# Copy the built frontend dist folder from the builder stage
COPY --from=builder /app/frontend/dist ./frontend/dist

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose server port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
