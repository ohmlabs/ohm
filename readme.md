[![npm version](https://badge.fury.io/js/ohm.svg)](https://badge.fury.io/js/ohm) [![Build Status](https://travis-ci.org/ohmlabs/ohm.svg?branch=master)](https://travis-ci.org/ohmlabs/ohm) [![StackShare](http://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](http://stackshare.io/camwes/ohm-fm) [![Coverage Status](https://coveralls.io/repos/github/ohmlabs/ohm/badge.svg?branch=master)](https://coveralls.io/github/ohmlabs/ohm?branch=master)
### Set up environment
Assuming you are running homebrew up-to-date on a Mac, here is how you configure your dev environment
```sh
brew install mongodb
brew install nvm
brew install redis
# Configure Dependencies
brew services start mongodb
nvm install v4.6.1
nvm alias default v4.6.1
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
# Dependencies:
For Full details see [package.json](https://github.com/ohmlabs/ohm/blob/master/package.json)

* [Node.js](https://nodejs.org/en/)
* [Express.js](http://expressjs.com/guide.html)
* [Parse Server](https://github.com/ParsePlatform/parse-server)
* [Ghost](https://ghost.org/)
* [Socket.io](https://github.com/socketio/socket.io)
* [underscore](http://underscorejs.org/)

My recommended frontend stack:
* [React.js](https://facebook.github.io/react/)
* [Grunt](http://gruntjs.com/)
* [Webpack](https://webpack.github.io/)
* [Babel](https://babeljs.io/)


# Contributing
# Architecture
The server architecture is evolving more information to come.
```sh
├── client
│   ├── js                        # client scripts
│   ├── images                    # raw image files
│   └── sass                      # sass files
├── ohm
│   ├── apis                      # API initializations (Parse, AWS)
│   ├── config
│   ├── models
│   ├── ghost
│   ├── controllers
│   ├── routes
│   └── views                     
│   |   └── bootloader.pug        # the sole view which loads a javascript file
├── static                        # compiled assets
├── package.json
├── gruntfile.js
└── ohm.js
```
### Debugging
If you are using [node-inspector](https://github.com/node-inspector/node-inspector) the run command by default passes the necessary flag to attach to the debugger, but you must start node inspector like so first:
```sh
grunt node-inspector &
# navigate to http://127.0.0.1:8090/debug?port=5960
```
