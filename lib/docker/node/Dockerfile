# Set the base image to Ubuntu
FROM node:argon

# File Author / Maintainer
MAINTAINER Cameron Drake

# Install nodemon
RUN npm install -g nodemon
# run npm install if necessary
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

WORKDIR /app

# Build Files
COPY package.json /app
COPY webpack.config.js /app
# Application files
COPY server.js /app
COPY lib /app/lib

# App Specific files
COPY example/basic /app/example

EXPOSE 8888

# Run app using nodemon
CMD ["nodemon", "-p"]
