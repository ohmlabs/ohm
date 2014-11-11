module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    concat:
      options:
        separator: ";"

      dist:
        src: ["client/js/**/*.js"]
        dest: "static/js/<%= pkg.name %>.js"

    jsdoc:
      dist:
        src: ["readme.md", "client/js/**/*.js", "server/**/*.js", "*.coffee", "*.js"]
        options:
          destination: 'static/jsdoc'

    copy:
      main:
        expand: true,
        cwd: 'client/js/',
        src: ['**/*.js']
        dest: 'static/js/'

    # generate a plato report on the project's javascript files
    plato:
      options:
        jshint : grunt.file.readJSON('.jshintrc')
      your_task:
        files: 
          "static/plato": ["<%= jsdoc.dist.src %>"]

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
          src : 'static/css/*.css'
        options:
          watchTask: true

    # Open files
    open:
      plato:
        path: 'http://127.0.0.1:8888/plato/'
      jsdoc:
        path: 'http://127.0.0.1:8888/jsdoc/'
      dev:
        path: 'http://127.0.0.1:8888'

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

    perfbudget:
      default:
        options:
          url: 'http://ohm.fm'
          key: ''
          runs: 1
          budget:
            speedIndex: '1500'

    pagespeed:
      options:
        nokey: true
        url: "http://ohm.fm"
      paths:
        options:
          paths: ["/"]
          locale: "en_US"
          strategy: "desktop"
          threshold: 80
      
    imagemin:
      dist:
        options:
          cache: false
        files: [
          expand: true
          cwd: 'client/images/'
          src: '{,*/}*.{png,jpg,jpeg,gif}'
          dest: 'static/img/'
        ]
    ### 
    Compass Configuration
    ###
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
          'ohm.js': 'ohm.coffee'

    ### 
    Grunt Forever Task
    ###
    forever:
      options:
        index: 'ohm.js' 
        logDir: 'logs'
        command: 'node --debug=5858'
        logFile: 'ohm.log'
        errFile: 'ohm-error.log'
    ###
    Watch Task
        1.) compile sass
        2.) concat and minify js
        3.) reload the page if js or dom changed
        4.) restart the server if necessary
    ###
    watch:
      sass:
        files: "client/**/*.sass"
        tasks: "compass:dev"
      scripts:
        files: '<%= concat.dist.src %>'
        tasks: ['copy']
      livereload:
        options:
          livereload: true
        files: ["static/css/*.css", "server/views/**/*.jade"]

  grunt.loadNpmTasks "grunt-contrib-imagemin"
  grunt.loadNpmTasks "grunt-pagespeed"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-perfbudget"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-compass"
  grunt.loadNpmTasks "grunt-browser-sync"
  grunt.loadNpmTasks "grunt-jsdoc"
  grunt.loadNpmTasks "grunt-bump"
  grunt.loadNpmTasks "grunt-open"
  grunt.loadNpmTasks "grunt-plato"
  grunt.loadNpmTasks "grunt-forever"
  grunt.loadNpmTasks "grunt-contrib-coffee"

  # the bare grunt command only compiles
  grunt.registerTask "default", ["coffee", "concat", "copy", "compass:dev"]
  # in testing, concat and plato
  grunt.registerTask "docs", ["pagespeed", "perfbudget", "plato", "jsdoc"]
  # in production, concat and minify
  grunt.registerTask "prod", ["concat", "uglify", "copy", "compass:prod"]
  # versioning, bust the cache, bump the version, push to origin
  grunt.registerTask "version", ["coffee", "copy", "concat", "uglify", "compass:prod", "imagemin",  "bump"]
