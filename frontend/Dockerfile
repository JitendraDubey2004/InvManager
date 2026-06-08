# ==========================================
# Stage 1: Build the React Application
# ==========================================
FROM node:22-alpine as build

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install listed dependencies
RUN npm install

# FORCE INSTALL missing dependencies that might not be in package.json
RUN npm install react-router-dom framer-motion lucide-react recharts react-hook-form @hookform/resolvers yup react-hot-toast axios @reduxjs/toolkit react-redux

# Copy the rest of your frontend source code
COPY . .

# Accept the API URL as a build argument from docker-compose
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the production static files
RUN npm run build

# ==========================================
# Stage 2: Serve with Nginx
# ==========================================
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]