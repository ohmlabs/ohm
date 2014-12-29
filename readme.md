# Ohm - Node.js Starter Application
Ohm is an opinionated full-stack Node.js environment to jumpstart a web project. Based on [Express](http://expressjs.com/guide.html), ohm uses [Grunt](http://gruntjs.com/) for automation, [Compass](http://compass-style.org/) (SASS) for CSS pre-processing and npm & bower for dependencies. It also integrates the [Ghost](http://ghost.org) as a blog CMS. Ohm is designed to be run proxied by [Nginx](http://nginx.org) in production. I've included some basic mixins and figures that can be helpful in making web layouts quickly, and uses bootstrap. Ohm comes preconfigured with production/development environments (production minifies all files including the html markup) as well as example server config files (using Nginx to serve static files, and proxying ohm).

# Features
* HTML5 ready. Use the new elements with confidence.
* CSS resets (normalize.css) and common bug fixes.
* Compression and spriting of images
* Designed with progressive enhancement in mind.
* An optimized Google Analytics snippet.
* Make powerful use of ```grunt watch```
* Adhere to Steve Sauders Rules for High Performance Websites:

# Installing
Installing and using Ohm should be simple:
```sh
# clone the repo
git clone https://github.com/ohmlabs/ohm.git your-repo && cd your-repo

# link the binary so ohm command can be used globally
npm link

# install npm dependencies
npm install

# install dependencies (must be done first)
ohm --install
```
Ohm can do a lot more, you can check out the available options like so: 
```sh
ohm --help

  Usage: ohm [options]

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -b, --bump, bump        Versioning App using git tags, package.json
    -d, --docs, docs        Generating JSDocs and Plato Reports
    -i, --install, install  Installing... (package.json, Gemfile, bower.json)
    -l, --list, list        Running Node.js Apps...
    -p, --prod, prod        Generating Production Ready Assets...
    start, --start          Starting App with Forever...
    stop, --stop            Stopping App with Forever...

```
# Dependencies:
* [Express (Node.js framework)](http://expressjs.com/guide.html)
* [Grunt (Javascript Task Runner)](http://gruntjs.com/)
* [Compass(CSS framework)](http://compass-style.org/)
* [Full Server dependencies (package.json)](https://github.com/ohmlabs/ohm/blob/master/package.json)
* [Full Client dependencies (bower.json)](https://github.com/ohmlabs/ohm/blob/master/bower.json)


# Running
In development, we use forever and grunt to start the server as a daemon. The server runs on port 8888, the ghost server on port 8889. You must however access the ghost server via localhost:8888/blog (that slug 'blog' can be changed [here](https://github.com/ohmlabs/ohm/blob/master/ohm.coffee#L26))
```sh
# start ohm on http://localhost:8888/
ohm start

# stop ohm
ohm stop

# list running forever apps
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
ohm prod

# start in production
node ohm.js -p

# increment git version
ohm bump

# alternatively you can:
# grunt bump:patch
# grunt bump:minor
# grunt bump:major
```
# Extending
I have been working to extend the functionality that this app provides beyond a boilerplate and you can learn more about the plugins [here](https://github.com/ohmlabs/ohm/blob/master/docs/plugins.md).

### [Lightbox Plugin](https://github.com/ohmlabs/ohm/blob/master/docs/plugins.md#lightbox-plugin)
Supports Instagram integration and general photo lightbox functionality. Requires instagram-node module.

### [Google Maps Plugin](https://github.com/ohmlabs/ohm/blob/master/docs/plugins.md#google-maps-plugin)
A simple plugin for drawing Google maps with custom styles, infowindows and markers.

### Client Dependencies
The repos provides examples of how to include client-side add-ons included via Bower. There are advantages to each of these libraries and I would certainly not recommend using them all together as it can really add in terms of HTTP requests and page download size (remember Souders rules!). Modernizr is useful for any project. Many users love using underscore and/or jQuery. Personally I prefer to use d3 instead of jQuery. Although it's larger in terms of download size it can do a lot of the same things jQuery can do and a whole lot more. Skrollr is very useful if you are working on a single page app or want to add parallax effects to your site. Finally, socket.io is a great library for building a real time web app. You can add to these but you should notice how I use the controller to [selectively include dependencies for each view](https://github.com/ohmlabs/ohm/blob/master/server/controllers/SampleController.js#L6)

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
ohm docs
```
### Debugging
The dock repo includes node-inspector in the global node modules that were installed, so learn more about [how to use it](https://github.com/node-inspector/node-inspector). The gruntfile by default passes the necessary flag to run the debugger, but you must start node inspector:
```sh
node-inspector &
# navigate to http://127.0.0.1:8080/debug?port=5858
```
# Roadmap
* Amazon Web Services integration
* Parse backend integration
* Socket.io integration
* Require.js support
* Support multiple templating platforms (.hbs, .jade, angular etc.)
* Yeoman Generator
* Ghost Theme

# Credit
Much credit goes to a number of excellent boilerplates out there that inspired me along the way:

* [Bootstrap](http://getbootstrap.com/)
* [MEAN.io](http://www.mean.io/#!/)
* [HTML5 Boilerplate](https://github.com/h5bp/html5-boilerplate)
* [Hackathon Starter](https://github.com/sahat/hackathon-starter/blob/master/app.js)
* [Google Web Starter Kit](https://github.com/google/web-starter-kit)

# License
ohm is licensed under the MIT license
