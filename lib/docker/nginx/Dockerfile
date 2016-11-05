# Set nginx base image
FROM nginx

# File Author / Maintainer
MAINTAINER Cameron Drake

# Copy custom configuration file from the current directory
RUN mkdir -p /app
COPY dist /app/dist
COPY ohm/docker/nginx/nginx.conf /etc/nginx/nginx.conf