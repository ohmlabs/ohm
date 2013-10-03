module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    concat:
      options:
        separator: ";"

      dist:
        src: ["js/**/*.js"]
        dest: "www/js/<%= pkg.name %>.js"

    uglify:
      options:
        banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"dd-mm-yyyy\") %> */\n"

      dist:
        files:
          "www/js/<%= pkg.name %>.min.js": ["<%= concat.dist.dest %>"]

    qunit:
      files: ["test/**/*.html"]

    compass:
      dev:
        options:
          config: "app/config/config.rb"
          sassDir: 'sass'
          cssDir: 'www/css'
      prod:
        options:
          config: "app/config/prod_config.rb"
          sassDir: 'sass'
          cssDir: 'www/css'

    jshint:
      files: ["gruntfile.coffee", "js/**/*.js"]
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
          'server.js': 'server.coffee'
    forever:
      options:
        index: 'server.js' 
        logDir: 'logs'
        logFile: 'node-bp.log'
        errFile: 'err-node-bp.log'
    watch:
      css:
        files: "**/*.sass"
        tasks: "compass:dev"
      scripts:
        files: '<%= jshint.files %>'
        tasks: ['concat', 'coffee', 'uglify', 'forever:restart']
          
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
  grunt.registerTask "default", [ "concat", "coffee", "compass:dev", "uglify", "forever:restart"]
  # on production, concat and minify
  grunt.registerTask "prod", ["concat", "coffee", "compass:prod", "uglify", "forever:restart"]
