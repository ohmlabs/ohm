module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    concat:
      options:
        separator: ";"

      dist:
        src: ["client/js/**/*.js"]
        dest: "static/js/<%= pkg.name %>.js"

    uglify:
      options:
        banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"dd-mm-yyyy\") %> */\n"

      dist:
        files:
          "static/js/<%= pkg.name %>.min.js": ["<%= concat.dist.dest %>"]

    # browser sync works with the watch task to inject css when updated
    browser_sync:
      dev:
        bsFiles:
          src : 'static/css/style.css'
        options:
          watchTask: true

    # Cache Busting for production
    cacheBust:
      options:
        encoding: 'utf8',
        algorithm: 'md5',
        length: 8
        rename: true
      assets:
        files:
          src: ["server/views/includes/common.jade", "server/views/includes/scripts.jade"]

    # Open files
    open:
      plato:
        path: 'http://127.0.0.1:8080/plato/'
      dev:
        path: 'http://127.0.0.1:8080'

    # Bump for managing releases:
    #     1.) bump up version on package.json
    #     2.) increment git tag
    bump:
      options:
        files: ['package.json']
        updateConfigs: []
        commit: true
        commitMessage: 'Release v%VERSION%'
        commitFiles: ['package.json'] # '-a' for all files
        createTag: true
        tagName: 'v%VERSION%'
        tagMessage: 'Version %VERSION%'
        push: true
        pushTo: 'origin'
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' # options to use with '$ git describe'

    # generate a plato report on the project's javascript files
    plato:
      options:
        jshint : grunt.file.readJSON('.jshintrc')
      your_task:
        files: 
          "static/plato": ["static/js/*.js", "server/**/*.js"]

    imagemin:
      png:
        options:
          optimizationLevel: 7
          cache: false
        files: [
          expand: true
          cwd: 'images/'
          src: ['**/*.png', '*.png']
          dest: 'static/img/'
          ext: '.png'
        ]
      jpg:
        options:
          progressive: true
          cache: false
        files: [
          expand: true
          cwd: 'images/'
          src: ['**/*.jpg', '*.jpg']
          dest: 'static/img/'
          ext: '.jpg'
        ]

    compass:
      dev:
        options:
          config: "server/config/config.rb"
      prod:
        options:
          config: "server/config/prod_config.rb"

    # compile  coffeescript, only included the server file as an example.
    coffee:
      compile:
        files:
          'drake.js': 'drake.coffee'

    forever:
      options:
        index: 'drake.js' 
        logDir: 'logs'
        logFile: 'node-bp.log'
        errFile: 'err-node-bp.log'

    # this watch task does a lot:
    #     1.) compile sass
    #     2.) concat and minify js
    #     3.) reload the page if js or dom changed
    #     4.) restart the server if necessary
    watch:
      sass:
        files: "client/**/*.sass"
        tasks: "compass:dev"
      scripts:
        files: 'client/js/*.js'
        tasks: ['concat', 'coffee', 'uglify']
      livereload:
        options:
          livereload: true
        files: ["static/**/*", "server/views/*"]
      server:
        files: ["gruntfile.coffee", "boilerplate.coffee", "server/**/*.js"]
        tasks: ["coffee", "forever:restart"]
                          
  grunt.loadNpmTasks "grunt-contrib-imagemin"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-compass"
  grunt.loadNpmTasks "grunt-browser-sync"
  grunt.loadNpmTasks "grunt-cache-bust"
  grunt.loadNpmTasks "grunt-bump"
  grunt.loadNpmTasks "grunt-open"
  grunt.loadNpmTasks "grunt-plato"
  grunt.loadNpmTasks "grunt-forever"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  # the bare grunt command only compiles
  grunt.registerTask "default", ["concat", "uglify", "imagemin", "compass:dev"]
  # in production, concat and minify
  grunt.registerTask "prod", ["concat", "uglify", "compass:prod", "plato", "open:plato", "imagemin"]
  # versioning, bust the cache, bump the version, push to origin
  grunt.registerTask "prod", ["concat", "uglify", "compass:prod", "plato", "cacheBust", "bump", "imagemin"]
