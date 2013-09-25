module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    concat:
      options:
        separator: ";"

      dist:
        src: ["js/**/*.js"]
        dest: "public/js/<%= pkg.name %>.js"

    uglify:
      options:
        banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"dd-mm-yyyy\") %> */\n"

      dist:
        files:
          "public/js/<%= pkg.name %>.min.js": ["<%= concat.dist.dest %>"]

    qunit:
      files: ["test/**/*.html"]

    compass:
      dev:
        options:
          config: "config/config.rb"
          sassDir: 'sass'
          cssDir: 'public/css'
      prod:
        options:
          config: "config/prod_config.rb"
          sassDir: 'sass'
          cssDir: 'public/css'

    jshint:
      files: ["gruntfile.coffee", "js/**/*.js"]
      options:
        # options here to override JSHint defaults
        globals:
          jQuery: true
          console: true
          module: true
          document: true

    watch:
      css:
        files: "**/*.sass"
        tasks: "compass:dev"
      scripts:
        files: '<%= jshint.files %>'
        tasks: ['concat', 'qunit', 'jshint']
          
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-contrib-qunit"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-compass"

  # to test the javascript use test task
  grunt.registerTask "test", ["jshint", "qunit"]
  # on the dev server, only concat
  grunt.registerTask "default", [ "watch"]
  # on production, concat and minify
  grunt.registerTask "prod", ["concat", "compass:prod", "uglify"]