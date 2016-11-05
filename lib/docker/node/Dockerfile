# Set the base image to Ubuntu
FROM node:argon

# File Author / Maintainer
MAINTAINER Cameron Drake

# Install nodemon
RUN npm install -g nodemon

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

WORKDIR /app

COPY package.json /app
COPY webpack.config.js /app
COPY Gruntfile.js /app
COPY grunt /app
COPY _include.js /app

COPY client /app/client
COPY dist /app/dist
COPY ohm.js /app
COPY ohm /app/ohm

COPY sample /app/sample

# Expose port
EXPOSE 8888

# Run app using nodemon
CMD ["nodemon", "-p"]
