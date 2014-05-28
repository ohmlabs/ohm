# Ohm
Ohm is an opinionated full-stack Node.js environment to jumpstart a web project. Based on [Express](http://expressjs.com/guide.html), ohm uses [grunt](http://gruntjs.com/) for automation, [Compass](http://compass-style.org/) (SASS) for CSS pre-processing and npm & bower for dependencies. It also integrates the [Ghost Blogging](http://ghost.org) platform as a CMS. Ohm is designed to be run proxied by [NGINX](nginx.org). For more see the [dock repo](https://github.com/ohmlabs/dock).  I've included some basic mixins and figures that can be helpful in making web layouts quickly, I also am going to gradually integrate Bootstrap features. Ohm comes preconfigured with production/development environments (production minifies all files including the html markup) as well as example server config files (using Nginx to serve static files, and proxying ohm and ghost).

# Features
* Adhere to Steve Sauders Rules for High Performance Websites:
* HTML5 ready. Use the new elements with confidence.
* Designed with progressive enhancement in mind.
* An optimized Google Analytics snippet.
* Seamless integration w/ Amazon Web Services
* Automatically compile Sass
* Automatically compress images for production
* Automatically compile CoffeeScript, concatinate, minify, and lint scripts
* Automatically compression and spriting of images
* Normalize.css and common bug fixes.

# Dependencies:
* [Express (Node.js framework)](http://expressjs.com/guide.html)
* [Grunt (Javascript Task Runner)](http://gruntjs.com/)
* [Compass(CSS framework)](http://compass-style.org/)
* [Normalize (CSS normalizations)](http://necolas.github.io/normalize.css/)
* [Full Server dependencies (package.json)](https://github.com/ohmlabs/boilerplate/blob/master/package.json)
* [Full Client dependencies (bower.json)](https://github.com/ohmlabs/boilerplate/blob/master/bower.json)

# Installing
In order to configure a development environment sufficient for running this boilerplate I recommend using our [environment repo](https://github.com/ohmlabs/environment). If you are confident that your environment is properly configured installing the app is very easy:
```sh
# install ohm
git clone https://github.com/ohmlabs/ohm.git
cd ohm
npm link
ohm install
```
# Architecture
This boilerplate attempts to have the simplest possible structure. Code is grouped into three main classes: server, client, and static. The server directory contains the files that reside on the server (views to be rendered, logic for the app). I actually lied when I said there were three classes because the Static and Client directories are actually the same thing. The client directory contains *pre-compiled* code that the user will need on the client-side for the app (Sass files and Javascript code). The static directory files are all generated automatically in the grunt compile process (client/sass files are compiled to static/css, client/js files are concated and/or minified into one file which is compiled into static/js). You should NEVER have to edit static files, they should be generated automatically (except in the case of adding images or other filetypes that are not a part of the compile process e.g. *.php or *.txt)

If you are a designer most of your time will be spent in the client directory. If you are a back-end developer you'd work predominately in the server folder.
```sh
├── client
│   ├── js
│   ├── images
│   └── sass
├── logs
│   ├── err-node-bp.log
│   └── node-bp.log
├── server
│   ├── apis
│   ├── config
│   ├── routes
│   ├── ghost
│   |   ├── content
│   |   └── config.js
│   ├── routes
│   └── views
├── static
│   ├── components
│   ├── css
│   ├── img
│   ├── js
│   ├── jsdoc
│   └── plato
└── tutorials
├── boilerplate.coffee
├── boilerplate.js
├── bower.json
├── package.json
├── gruntfile.coffee
├── .bowerrc
├── .gitignore
├── .gitmodules
├── .jshintrc
├── readme.md
```
# Running
In development, we use forever and grunt to start the server as a daemon. The cli takes care of this:
```sh
# start ohm
ohm start

# stop ohm
ohm stop

# show all forever process
ohm list

#  The almighty watch command
grunt watch
```
To best streamline the development process this project uses grunt.js (a JavaScript Task Runner). There is so much that you can automate with grunt, but the included gruntfile is configured to fulfill the following tasks:
* Compile Coffee-script
* Compile CSS 
* Concatenate JavaScript Files
* Minify JavaScript Files
* Jshint your javascript files
* Restart the Server (Forever)
* Reload the Browser (LiveReload)
* Inject CSS w/o reload (Browser-sync)
* Inspect Code Source (node-inspector)
* Profile Server (StrongOps)

When you install the boilerplate it begins running on port http://localhost:8080. You can use grunt from then on to interact with the server:
### Versioning the App
The best thing about this boilerplate is that when used in conjunction with our [dock repo](https://github.com/ohmlabs/dock) can be used to fully deploy a node.js web app. First you must generate production assets, and then version your app. To only generate production assets, first checkout a production branch. You can compile and test the app with new static assets. Once you are satisfied and ready to release execute the ```ohm version``` command:
* compiles production assets
* bumps the version tag for git
* compresses images
```sh
# only generate production assets and start in production
grunt prod; node ohm.js -p
# commit changes
git add .
git ci -m 'pushing to production'
# generate relase assets and version branch (bump, imagemin)
ohm version
# alternatively you can:
# grunt bump:patch
# grunt bump:minor
# grunt bump:major
git push production prod  # push to the actual server
git push origin prod      # push to github servers
```
# Extras
There are a few client-side add-ons included via Bower. There are advantages to each of these libraries and I would certainly not recommend using them all together as it can really add in terms of HTTP requests and page download size (remember Souders rules!). Modernizr is useful for any project. Many users love using underscore and/or jQuery. Personally I prefer to use d3 instead of jQuery. Although it's larger in terms of download size it can do a lot of the same things jQuery can do and a whole lot more. Skrollr is very useful if you are working on a single page app or want to add parallax effects to your site. Finally, socket.io is a great library for building a real time web app.

* [modernizr](http://modernizr.com/)
* [underscore](http://underscorejs.org/)
* [jquery](http://jquery.com/)
* [d3](http://d3js.org/)
* [skrollr](https://github.com/Prinzhorn/skrollr) (also IE, color, menu and stylesheets plugins)
* [socket.io](http://socket.io/#how-to-use)

```sh
# generate Plato & jsdoc Reports (complexity analysis, lint & jsdoc)
# documentation - localhost:8888/jsdoc
# plato         - localhost:8888/plato
ohm docs
```
This command will generate jsdoc documentation and perform jslint on both client and server files. An added bonus here is [Plato](https://github.com/jsoverson/plato), which will run jshint and get data on [complexity analysis](http://jsoverson.github.io/plato/examples/jquery/) on your javascript files.

Additionally, If you use the watch command you get the benefit of automatic CSS injection and page reloading via LiveReload [chrome extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei) and [browser-snyc](https://github.com/shakyShane/grunt-browser-sync). I also included node-inspector in the global node modules that were installed, so learn more about [how to use it](https://github.com/node-inspector/node-inspector). The gruntfile by default passes the necessary flag to run the debugger, but you must start node inspector:
```sh
node-inspector &
ohm start
# navigate to localhost:5858
```

You can also monitor your servers performance using [strongOps](http://strongloop.com/node-js-performance/strongops/). All you need to do is sign up for an account, this occurs automatically in the prod environment script.
```sh
$ cd your-app-dir
$ slc strongops --register
# If you already have a StrongOps account, don't use --register.
# Complete your registration at the strongOps site
```
# Browser Support
# License
This boilerplate is licensed under the MIT license
