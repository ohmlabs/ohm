[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.png?v=103)](https://opensource.org/licenses/mit-license.php) [![npm version](https://badge.fury.io/js/ohm.svg)](https://badge.fury.io/js/ohm) [![NSP Status](https://nodesecurity.io/orgs/ohm/projects/b7413ae1-6468-4de8-8e57-2f619122c519/badge)](https://nodesecurity.io/orgs/ohm/projects/b7413ae1-6468-4de8-8e57-2f619122c519) ![dependencies](https://david-dm.org/ohmlabs/ohm.svg) [![Build Status](https://travis-ci.org/ohmlabs/ohm.svg?branch=master)](https://travis-ci.org/ohmlabs/ohm) [![StackShare](http://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](http://stackshare.io/camwes/ohm-fm) [![Coverage Status](https://coveralls.io/repos/github/ohmlabs/ohm/badge.svg?branch=master)](https://coveralls.io/github/ohmlabs/ohm?branch=master)
### Set up environment
Assuming you are running homebrew up-to-date on a Mac, here is how you configure your dev environment
```sh
brew install mongodb
brew install nvm
brew install redis
# Configure Dependencies
brew services start mongodb
nvm install v6.10.2
nvm alias default v6.10.2
npm install -g bower
redis-server &
```
### Install
```sh
npm install --save ohm
```
### Usage
create a new file `server.js` and create a config file.
```javascript
(function() {
  'use strict';

  const config        = require('./config.js');
  const Ohm           = require('ohm');

  module.exports = new Ohm(config);
}());
````
##### required params
* `env`: environment variable
* `host`: hostname
* `port`: port
* `MONGO_DB`: Mongodb database name
* `VIEWS_DIR`: location of the pug views directory
* `ROUTES`: location of the site's regular routes
* `SESSION_KEY`: the key used for the cookie
* `SOCKETIO_SESSION_SECRET`
* `PARSE_PATH`: route for parse server
* `PARSE_DASHBOARD`: route for parse dashboard
* `PARSE_APPLICATION_ID`
* `PARSE_JAVASCRIPT_KEY` 
* `PARSE_MASTER_KEY`

##### optional params:
* `MONGO_URI`: mongdb url (e.g. mongodb://MONGO_HOST:MONGO_PORT)
* `MONGO_PORT`: port for mongoDB (default localhost)
* `MONGO_HOST`: host for mongoDB (default 27017)
* `REDIS_PORT`: port for redis (default 6379)
* `REDIS_HOST`: host for redis (default localhost)
* `GHOST_PATH`: the path that ghost CMS will use
* `GHOST_CONFIG`: location of the ghost config
* `SOCKETS`: location of the site's sockets routes

# Dependencies:
For Full details see [package.json](https://github.com/ohmlabs/ohm/blob/master/package.json)

* [Node.js](https://nodejs.org/en/)
* [Express.js](http://expressjs.com/guide.html)
* [Parse Server](https://github.com/ParsePlatform/parse-server)
* [Socket.io](https://github.com/socketio/socket.io)
```
