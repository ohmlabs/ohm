# Boilerplate for Designers 
### [The Designer's Guide to Full-Stack Development](tutorials/readme.md)

This is a very simple Node.js Boilerplate that uses Express, Jade, Stylus, Nib and Coffeescript. It does absolutely nothing, but provides a good structure for your app as well as configured middleware so that you can immediately get to work. I've included some mixins and figures that can be helpful in making basic web layouts quickly. Although LESS is very well integrated with Node.js, I chose to use SASS because Compass is an excellent tool. This Boilerplate comes preconfigured with Production/Development Environments as well as server config files that allow you to proxy node.js (I highly recommend that you use a faster webserver like Nginx to serve static files, and proxy Node.js).

### Basic Application Structure
```sh
├── client
│   ├── js
│   └── sass
├── server
│   ├── config
│   ├── routes
│   └── views
├── static
│   ├── css
│   ├── img
│   └── js
├── boilerplate.coffee
├── boilerplate.js
├── gruntfile.coffee
├── package.json
├── readme.md
```

This boilerplate attempts to have the simplest possible structure. Code is grouped into three main classes: server, client, and static. The server directory contains the files that reside on the server (views to be rendered, logic for the app). I actually lied when I said there were three classes because the Static and Client directories are actually the same thing. The client directory contains *pre-compiled* code that the user will need on the client-side for the app (Sass files and Javascript code). The static directory files are all generated automatically in the grunt compile process (client/sass files are compiled to static/css, client/js files are concated and/or minified into one file which is compiled into static/js). You should NEVER have to edit static files, they should be generated automatically (except in the case of adding images or other filetypes that are not a part of the compile process e.g. *.php or *.txt)

If you are a designer most of your time will be spent in the client directory. If you are a back-end developer you'd work predominately in the server folder.
### Goals

* Adhere to Steve Sauders Rules for High Performance Websites:
* HTML5 ready. Use the new elements with confidence.
* Designed with progressive enhancement in mind.
* An optimized Google Analytics snippet.
* Seamless integration w/ Amazon Web Services
* Automatically compile Sass
* Automatically compile CoffeeScript, concatinate, minify, and Lint scripts
* Automatically compress and sprite images
* Modular styles to provide basic mixins and structure
* Normalized stlyes  and common bug fixes.

### Major components:

* For server dependencies see [package.json](https://github.com/cdrake757/boilerplate/blob/master/package.json)
* For client dependencies see [bower.json](https://github.com/cdrake757/boilerplate/blob/master/bower.json)
* [Express](http://expressjs.com/guide.html)
* [Animate.css](http://daneden.me/animate/)
* [Normalize.css](http://necolas.github.io/normalize.css/)

# Installing

Firstly, you will need to  install be sure that Ruby and Node are installed. If you have never configured a command line development environment, start [HERE](https://github.com/cdrake757/boilerplate/tree/master/tutorials#environment). Next execute the following commands:

```sh
cd boilerplate/
npm install -g bower grunt-cli forever coffee-script node-inspector 
npm install       # install node modules https://npmjs.org/
bower install     # install client dependencies http://bower.io/
gem install sass compasss ceaser-easing normalize
git submodule init
git submodule update
```

# Running
To best streamline the development process this project uses grunt.js (a JavaScript Task Runner). In development, Grunt will start the server as a daemon and watch the directory for file updates and automatically compile. There is so much that you can automate with grunt, but the included gruntfile is configured to fulfill the following tasks:

* Compile Coffeescript
* Compile CSS 
* Concatenate JavaScript Files
* Minify JavaScript Files
* Restart the Server (Using Forever)
* Reload the Browser using (LiveReload)

To compile and run: 

```sh
grunt
node boilerplate.js
```
To compile, start the server as a daemon and watch for changes:
```
grunt forever:start watch
```
Extra: You can configure the app to automatically refresh the page when changes are made using LiveReload [chrome extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei). I also included node-inspector in the global node modules that were installed, so learn more about [how to use it](https://github.com/node-inspector/node-inspector). Another great added bonus here is [Plato](https://github.com/jsoverson/plato), which will run jshint and get data on [complexity analysis](http://jsoverson.github.io/plato/examples/jquery/) on your javascript files.
```sh
grunt plato
# open the index file in the folder specified in the gruntfile and view report
```

In production:

```sh
grunt prod
node boilerplate.js -p # Don't forget the -p flag for production
# Or use forever to keep the server running as a daemon
forever start server.js -p 
```
# License
This boilerplate is licensed under the GPL license
