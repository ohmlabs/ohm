# Boilerplate for Designers 
## Cameron Drake
### [Tutorials for Beginners](tutorials/readme.md)

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

### Install Dependencies

Firstly, you will need to  install the node modules using Node Package Manger. 

```sh
cd boilerplate/
npm install
git submodule init
git submodule update
```

Next, you will need to install Sass and Compass. You can install compass easily assuming you have Ruby installed:

```sh
gem install sass
gem install compasss
# or any other plugins you may want
gem install ceaser-easing 
gem install normalize
```

### Running the Application
To best streamline the development process this project uses grunt.js (a JavaScript Task Runner). In development, Grunt will start the server as a daemon and watch the directory for file updates and automatically compile. There is so much that you can automate with grunt, but the included gruntfile is configured to fulfill the following tasks:

* Compile Coffeescript
* Compile CSS 
* Concatenate JavaScript Files
* Minify JavaScript Files
* Restart the Server (Using Forever)

To simply compile, type: 

```sh
grunt
```

To compile and also watch for changes, type: 

```sh
grunt forever:start watch
```

In production:

```sh
grunt prod
forever start server.js -p # Don't forget the -p flag for production
```
# Goals

* Adhere to Steve Sauders Rules for High Performance Websites:
* HTML5 ready. Use the new elements with confidence.
* Designed with progressive enhancement in mind.
* CSS normalizations and common bug fixes.
* Responsive Design templates.
* Modular SASS to provide basic mixins and structure
* The latest jQuery via CDN.
* An optimized Google Analytics snippet.

# Major components:

* For server dependencies see package.json
* [jQuery](http://docs.jquery.com/Tutorials:How_jQuery_Works)
* [CoffeeScript](http://coffeescript.org/)
* [Express](http://expressjs.com/guide.html)
* [Compasss](http://compass-style.org/reference/compass/)
* [Animate.css](http://daneden.me/animate/)
* [Normalize.css](http://necolas.github.io/normalize.css/)

### Recommended Software

* [TextMate](http://macromates.com/)
* [Emacs](http://www.gnu.org/software/emacs/)
* [Github](http://github.com/) 
* [Homebrew](http://mxcl.github.com/homebrew/)
* [Local Tunnel](http://progrium.com/localtunnel/)
* [Yeoman](http://yeoman.io/)

### Recommended Sites 

* [Dropbox](http://db.tt/VmtPYp51)
* [Stack Overflow](http://stackoverflow.com/)
* [cheat sheets](http://cheat.errtheblog.com/)
* [HTML5 Please](http://html5please.com/)
* [CSS3 Please](http://css3please.com/)
* [HTML5 Boilerplate](https://github.com/h5bp/html5-boilerplate)
* [Tabifier](http://tools.arantius.com/tabifier)
* [DocHub](http://dochub.io/#css/)
* [Quora](http://quora.com/)
* [jsFiddle](http://jsfiddle.net/)
* [Gists](https://gist.github.com/)

### Recommeded Reading

The readings listed and some additional readings can be found in this [dropbox folder](https://www.dropbox.com/sh/svziy2elww23mtm/Za0UvpSKoA).


* High Performance Web Sites - Steve Souders 
* CSS The Definite Guide - Eric A Meyer
* CSS Pocket Reference - Eric A Meyer
* Javascript: The Good Parts - Douglas Crockford
* Secrets of the Javascript Ninja - John Resig
* JQuery Novice to Ninja - Early Castledine and Craig Sharkie
* Responsive Design - Ethan Marcotte
