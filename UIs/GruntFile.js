module.exports = function(grunt) {

  grunt.initConfig({

    ngconstant: {
      // Options for all targets
      options: {
        dest: 'js/variables.js',
        space: '  ',
        wrap: '"use strict";\n\n {%= __ngModule %}',
        name: 'app.env'
      },

      // Environment targets

      development: {
        constants: {
          ENV: {
            NAME: 'development',
            API_URL: "//localhost:3000/v1/",
            UI_URL: "//localhost:7000/",
            VERSION: "1.0.0"
          }
        }
      },

      production: {
        constants: {
          ENV: {
            NAME: 'production',
            API_URL: "//localhost:3000/v1/",
            UI_URL: "//localhost:7000/",
            VERSION: "1.0.0"
          }
        }
      },

    },

    concat: {
      options: {
        separator: '',
      },
      dist: {
        src: [
          'js/app.js',
          'js/variables.js',
          'js/services/**/*.js',
          'js/directives/**/*.js',
          'js/controllers/*.js',
          'js/controllers/**/*.js',
          'js/directives/*.js'
        ],
        dest: 'js/all.js',
      },
    },

    uglify: {
      options: {
        mangle: false
      },
      target: {
        files: {
          'js/all.min.js': [
            'js/all.js'
          ]
        }
      }
    },


    // not actually used for minimizing css files.
    cssmin: {
      options: {
        shorthandCompacting: true,
        roundingPrecision: -1,
        keepSpecialComments: 0
      },
      target: {
        files: {
          'css/all.min.css': [
            'css/*.css'
          ]
        }
      }
    },

    watch: {
      scripts: {
        files: ['js/**/*.js', '!js/all.js', '!js/all.min.js'],
        tasks: ['concat', 'uglify']
      }
    },

    // usebanner: {
    //   taskName: {
    //     options: {
    //       position: 'top',
    //       banner: '',
    //       linebreak: false
    //     },
    //     files: {
    //       src: [
    //       'js/app.js',
    //       'js/variables.js',
    //       'js/services/*.js',
    //       'js/directives/*.js',
    //       'js/controllers/**/*.js'
    //     ]
    //     }
    //   }
    // },

  });

  grunt.loadNpmTasks('grunt-ng-constant');

  // Default task.
  grunt.registerTask('development', ['ngconstant:development']);
  grunt.registerTask('testing', ['ngconstant:testing']);
  grunt.registerTask('staging', ['ngconstant:staging']);
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-retire');
  // grunt.loadNpmTasks('grunt-contrib-cssmin');
  // grunt.loadNpmTasks('grunt-strip-css-comments');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-banner');
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('pack', ['concat', 'uglify']);
};
