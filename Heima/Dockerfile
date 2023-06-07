# Use the current node image as base
FROM node:alpine3.11

# PM2 will be used as PID 1 process
RUN npm install pm2@latest -g

# Create an application directory
RUN mkdir -p /app

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the frontend package.json file
COPY frontend/package.json ./frontend/

# Change directory to frontend and install modules
RUN cd ./frontend/ && npm install
RUN cd ./frontend/ && npm install react-select --force

# Copy all other data from frontend directory
COPY frontend/ ./frontend/

# Copy the backend package.json file
COPY backend/package.json ./backend/

# Change directory to backend and install modules
RUN cd ./backend/ && npm install

# Copy all other data from backend directory
COPY backend/ ./backend/
RUN cd ./backend && ls -al

# Copy process script
COPY scripts/* .

# Actual script to start can be overridden from `docker run`
CMD pm2 start process.json && tail -f /dev/null