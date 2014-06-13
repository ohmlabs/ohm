# ohm - Node.js Starter Application
ohm is an opinionated full-stack Node.js environment to jumpstart a web project. Based on [Express](http://expressjs.com/guide.html), ohm uses [Grunt](http://gruntjs.com/) for automation, [Compass](http://compass-style.org/) (SASS) for CSS pre-processing and npm & bower for dependencies. It also integrates the [Ghost](http://ghost.org) blogging platform as a CMS. ohm is designed to be run proxied by [Nginx](http://nginx.org). For more see [dock](https://github.com/ohmlabs/dock).  I've included some basic mixins and figures that can be helpful in making web layouts quickly, I also am going to gradually integrate Bootstrap features. ohm comes preconfigured with production/development environments (production minifies all files including the html markup) as well as example server config files (using Nginx to serve static files, and proxying ohm and ghost).

# Features
* HTML5 ready. Use the new elements with confidence.
* CSS resets (normalize.css) and common bug fixes.
* Compression and spriting of images
* Designed with progressive enhancement in mind.
* An optimized Google Analytics snippet.
* Make powerful use of ```grunt watch```
* Adhere to Steve Sauders Rules for High Performance Websites:

# Installing
If you are confident that your environment is properly configured skip this, but installing the app is very easy using [dock](https://github.com/ohmlabs/dock)
```sh
# clone the repo to computer for development
git clone https://github.com/ohmlabs/ohm.git your-repo
cd your-repo

# install the cli for running app or alternatively "npm link"
npm install -g ohm 

# install dependencies (must be done first)
ohm install

# equip your development machine (homebrew, cask, etc)
# https://github.com/ohmlabs/dock#development-environment
ohm dev

# provision production server
# https://github.com/ohmlabs/dock#production-deployment
ohm prod
```
# Dependencies:
* [Express (Node.js framework)](http://expressjs.com/guide.html)
* [Grunt (Javascript Task Runner)](http://gruntjs.com/)
* [Compass(CSS framework)](http://compass-style.org/)
* [Normalize (CSS normalizations)](http://necolas.github.io/normalize.css/)
* [dock Deployments](https://github.com/ohmlabs/dock)
* [Full Server dependencies (package.json)](https://github.com/ohmlabs/ohm/blob/master/package.json)
* [Full Client dependencies (bower.json)](https://github.com/ohmlabs/ohm/blob/master/bower.json)


# Running
In development, we use forever and grunt to start the server as a daemon. The cli takes care of this:
```sh
# start ohm on http://localhost:8888/
ohm start

# stop ohm
ohm stop

# show all forever process
ohm list

#  The almighty watch command
grunt watch
```
#### ```grunt watch```
To best streamline the development process this project uses grunt.js (a JavaScript Task Runner). There is so much that you can automate with grunt, but the included gruntfile is includes a powerful watch task with the following features:
* Automatic browser reloading (LiveReload) [chrome extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
* Automatic Sass compilation and css injection ([browser-snyc](https://github.com/shakyShane/grunt-browser-sync))
* Automatic concatination, minification, validation (lint, plato) and CoffeeScript compilation
* Automatically restart ohm on server file changes (Forever)


# Architecture
ohm attempts to have the simplest possible structure. Code is grouped into three main classes: server, client, and static. The server directory contains the files that reside on the server (views to be rendered, logic for the app). I actually lied when I said there were three classes because the Static and Client directories are actually the same thing. The client directory contains *pre-compiled* code that the user will need on the client-side for the app (Sass files and Javascript code). The static directory files are all generated automatically in the grunt compile process (client/sass files are compiled to static/css, client/js files are concated and/or minified into one file which is compiled into static/js). You should NEVER have to edit static files, they should be generated automatically (except in the case of adding images or other filetypes that are not a part of the compile process e.g. *.php or *.txt)

If you are a designer most of your time will be spent in the client directory. If you are a back-end developer you'd work predominately in the server folder.
```sh
├── bin
│   └── ohm                       # command line app
├── client
│   ├── js                        # client scripts
│   ├── images                    # raw image files 
│   └── sass                      # sass files
├── logs
│   ├── ohm-error.log             # error log
│   └── ohm.log                   # access log
├── server
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
│   ├── js                        # compiled js
│   ├── jsdoc                     # jsdoc documentation
│   └── plato                     # plato complexity reports
├── bower.json                    
├── package.json
├── gruntfile.coffee              # gruntfile (necessary for cli to work)
├── .bowerrc
├── .gitignore
├── .jshintrc
├── ohm.coffee                    # main file
└── ohm.js                        # compiled
```
# Versioning
The best thing about this ohm is that when used in conjunction with our [dock repo](https://github.com/ohmlabs/dock) can be used to fully deploy a node.js web app. First you must generate production assets, and then version your app. To only generate production assets, first checkout a production branch. You can compile and test the app with new static assets. Once you are satisfied and ready to release execute the ```ohm version``` command:
* compiles production assets
* bumps the git version


```sh
# compile production assets 
grunt prod

# start in production
node ohm.js -p

# increment git version
ohm version
# alternatively you can:
# grunt bump:patch
# grunt bump:minor
# grunt bump:major

# push to the production server
git push prod prod

# push to github server
git push origin prod
```
# Extending
ohm is built to be easily extended to include many additional features.
### Client Dependencies
There are a few client-side add-ons included via Bower. There are advantages to each of these libraries and I would certainly not recommend using them all together as it can really add in terms of HTTP requests and page download size (remember Souders rules!). Modernizr is useful for any project. Many users love using underscore and/or jQuery. Personally I prefer to use d3 instead of jQuery. Although it's larger in terms of download size it can do a lot of the same things jQuery can do and a whole lot more. Skrollr is very useful if you are working on a single page app or want to add parallax effects to your site. Finally, socket.io is a great library for building a real time web app.

* [modernizr](http://modernizr.com/)
* [underscore](http://underscorejs.org/)
* [jquery](http://jquery.com/)
* [d3](http://d3js.org/)
* [skrollr](https://github.com/Prinzhorn/skrollr) (also IE, color, menu and stylesheets plugins)
* [socket.io](http://socket.io/#how-to-use)

### Documentation & Validation
This command will generate jsdoc documentation and perform jslint on both client and server files. An added bonus here is [Plato](https://github.com/jsoverson/plato), which will run jshint and get data on [complexity analysis](http://jsoverson.github.io/plato/examples/jquery/) on your javascript files.
```sh
# generate Plato & jsdoc Reports (complexity analysis, lint & jsdoc)
# documentation - localhost:8888/jsdoc
# plato         - localhost:8888/plato
ohm docs
```
### Debugging
The dock repo includes node-inspector in the global node modules that were installed, so learn more about [how to use it](https://github.com/node-inspector/node-inspector). The gruntfile by default passes the necessary flag to run the debugger, but you must start node inspector:
```sh
node-inspector &
# navigate to http://127.0.0.1:8080/debug?port=5858
```
### Profiling
You can profile your servers performance using [strongOps](http://strongloop.com/node-js-performance/strongops/). All you need to do is sign up for an account.
```sh
$ cd your-app-dir
$ slc strongops --register
# If you already have a StrongOps account, don't use --register.
# Complete your registration at the strongOps site
```
# Roadmap
* Amazon Web Services integration
* Parse backend integration
* Socket.io integration
* Require.js support
* Support multiple templating platforms (.hbs, .jade, angular etc.)
* Yeoman Generator
* Ghost Theme

# License
ohm is licensed under the MIT license
