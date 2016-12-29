module.exports = function( grunt ) {

  grunt.initConfig({

    concat: {
      css: {
        src: [
            'source/metronic/assets/corporate/css/style.css',
            'source/metronic/assets/corporate/css/style-responsive.css',
            'source/metronic/assets/corporate/css/custom.css',
            'source/metronic/assets/corporate/css/themes/red.css',
            'source/css/theme.css' ],
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
        dest: 'source/js/js-full.min.js'
      }
    },

    stylus: {
      compile: {
        files: {
          'source/css/theme.css': ['source/css/*.styl']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask( 'default', [  'stylus', 'concat:css' , 'concat:js'] );

};
