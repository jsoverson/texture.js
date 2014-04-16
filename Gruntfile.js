

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-traceur');

  grunt.initConfig({
    watch : {
      build : {
        files : ['src/**/*.js'],
        tasks : ['build']
      }
    },
    traceur: {
      options: {
        asyncFunctions : true
      },
      custom: {
        files:{
          'dist/texture.js': ['src/texture.js']
        }
      },
    },
  });

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['traceur']);
}
