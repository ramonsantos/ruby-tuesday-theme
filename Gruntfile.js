module.exports = function( grunt ) {

  grunt.initConfig({

    stylus: {
      compile: {
        files: {
          'source/css/_css/_theme-styles.css': ['source/css/*.styl']
        }
      }
    },
    
    concat: {
      css: {
        src: [
            'source/css/_css/style.css',
            'source/css/_css/style-responsive.css',
            'source/css/_css/custom.css',
            'source/css/_css/red.css',
            'source/css/_css/_theme-styles.css' ],
        dest: 'source/css/css-full.css'
      },

      js: {
        options: {
          separator: ';',
        },
        src: [
            'source/js/_layout.js',
            'source/js/_back-to-top.js'
             ],
        dest: 'source/js/js-full.js'
      }
    }


  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask( 'default', [  'stylus', 'concat:css' , 'concat:js'] );

};
