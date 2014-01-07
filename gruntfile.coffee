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

    qunit:
      files: ["test/**/*.html"]

    compass:
      dev:
        options:
          config: "server/config/config.rb"
      prod:
        options:
          config: "server/config/prod_config.rb"

    jshint:
      files: ["gruntfile.coffee", "client/js/**/*.js"]
      options:
        # options here to override JSHint defaults
        globals:
          jQuery: true
          console: true
          module: true
          document: true
    coffee:
      compile:
        files:
          'boilerplate.js': 'boilerplate.coffee'
    forever:
      options:
        index: 'boilerplate.js' 
        logDir: 'logs'
        logFile: 'node-bp.log'
        errFile: 'err-node-bp.log'
    watch:
      css:
        files: "**/*.sass"
        tasks: "compass:dev"
      scripts:
        files: '<%= jshint.files %>'
        tasks: ['concat', 'coffee', 'uglify']
      server:
        files: ["gruntfile.coffee", "jukeboxx.js", "server/**/*.js"]
        tasks: "forever:restart"
                          
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-contrib-qunit"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-compass"
  grunt.loadNpmTasks "grunt-forever"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  # to test the javascript use test task
  grunt.registerTask "test", ["jshint", "qunit"]
  # on the dev server, only concat
  grunt.registerTask "default", [ "concat", "coffee", "compass:dev"]
  # on production, concat and minify
  grunt.registerTask "prod", ["concat", "coffee", "compass:prod", "uglify"]
