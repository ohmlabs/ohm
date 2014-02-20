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

    imagemin:
      png:
        options:
          optimizationLevel: 7
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

    # generate a plato report on the project's javascript files
    plato:
      options:
        jshint : grunt.file.readJSON('.jshintrc')
      your_task:
        files: 
          "logs/plato": ["static/js/*.js", "server/**/*.js"]

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
        tasks: "forever:restart"
                          
  grunt.loadNpmTasks "grunt-contrib-imagemin"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-compass"
  grunt.loadNpmTasks "grunt-browser-sync"
  grunt.loadNpmTasks "grunt-plato"
  grunt.loadNpmTasks "grunt-forever"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  # the bare grunt command only compiles
  grunt.registerTask "default", ["imagemin", "concat", "coffee", "compass:dev"]
  # in production, concat and minify
  grunt.registerTask "prod", ["imagemin", "concat", "uglify", "plato", "coffee", "compass:prod"]
