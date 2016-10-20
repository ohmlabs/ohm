# Installing
```sh
npm install
bower install
gem install
```
# Running
```sh
# start on http://localhost:8888/
npm start
#  The watch command
grunt watch
```
# Dependencies:
* [Full Server dependencies (package.json)](https://github.com/ohmlabs/ohm/blob/master/package.json)
* [Full Client dependencies (bower.json)](https://github.com/ohmlabs/ohm/blob/master/bower.json)

### Backend Tools
* [Node.js](https://nodejs.org/en/)
* [Express.js](http://expressjs.com/guide.html)
* [Parse Server](https://github.com/ParsePlatform/parse-server)
* [MongoDB](https://www.mongodb.com/)
* [Ghost](https://ghost.org/)

### Frontend Tools
* [React.js](https://facebook.github.io/react/)
* [Socket.io](https://github.com/socketio/socket.io)
* [underscore](http://underscorejs.org/)
* [d3](http://d3js.org/)
* [skrollr](https://github.com/Prinzhorn/skrollr) (also IE, color, menu and stylesheets plugins)

### Build Tools
* [Grunt](http://gruntjs.com/)
* [Compass](http://compass-style.org/)
* [Webpack](https://webpack.github.io/)
* [Babel](https://babeljs.io/)

# Architecture
The server architecture is evolving more information to come.
```sh
├── client
│   ├── js                        # client scripts
│   ├── images                    # raw image files 
│   └── sass                      # sass files
├── ohm
│   ├── apis                      # API initializations (Parse, AWS)
│   ├── config                    # config files for Compass, Express, Auth, etc.
│   ├── models                    # app models
│   ├── ghost
│   |   ├── content               # Ghost data, images & themes
│   |   └── config.js             # Ghost config file
│   ├── controllers               # app controllers
│   ├── routes                    # url routing
│   └── views                     # jade files for pages and templates
│   |   └── includes              # include files such as google analytics
├── static
│   ├── components                # bower managed client dependencies
│   ├── css                       # compiled css files
│   ├── img                       # compressed images
│   └── js                        # compiled js
├── bower.json                    
├── package.json
├── gruntfile.js                  # gruntfile (necessary for cli to work)
├── .bowerrc
├── .gitignore
├── .jshintrc
└── ohm.js
```

### Debugging
If you are using [node-inspector](https://github.com/node-inspector/node-inspector) the run command by default passes the necessary flag to attach to the debugger, but you must start node inspector like so first:
```sh
node-inspector &
# navigate to http://127.0.0.1:8080/debug?port=5960
```
