# Use an official Node.js image as the build environment
FROM node:23-alpine as build
# Set the working directory
WORKDIR /app
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .
# Build the Vite project
RUN npm run build

# Stage 2

# Use an official Nginx image as the production environment
FROM nginx:latest
# Set the working directory in the Nginx container
WORKDIR /usr/share/nginx/html
# Copy the built artifacts from the build container to the Nginx container
COPY --from=build /app/dist .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]