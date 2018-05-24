module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      main: {
        src: 'index-src.html',
        dest: 'index.html',
        options: {
          process: function (content, srcpath) {
            var v = '?v=' + Math.round(Math.random() * 99999);
            return content.replace("<!-- start.css -->", '<link rel="stylesheet" href="css/app.min.css'+v+'">\n<!-- Source:')
                          .replace("<!-- end.css -->", 'end source -->')
                          .replace("<!-- start.js -->", '<script src="js/app.min.js"></script>\n<!-- Source:')
                          .replace("<!-- end.js -->", 'end source -->');
          }
        }
      }
    },

    babel: {
        options: {
            sourceMap: false,
            presets: ['es2015'],
            minified: false,
            compact: false
        },
        dist: {
            files: [{
                expand: true,
                cwd: 'js',
                src: ['**/*.es6.js'],
                dest: 'js/min',
                ext: '.js'
            }]

        }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        mangle: false,
        compress: false,
        beautify: false,
        report: 'min'
      },
      build_site: {
        files: {
          'js/app.min.js': [
              "js/three/three.min.js",
              "js/vendor/fetch.js",
              "js/vendor/diddrag.js",
              "js/vendor/stats.min.js",
              "js/vendor/howler.core.min.js",
              "js/min/haxademic.js/app-store.js",
              "js/min/haxademic.js/app-store-debug.js",
              "js/min/haxademic.js/array-util.js",
              "js/min/haxademic.js/color-util.js",
              "js/min/haxademic.js/dom-util.js",
              "js/min/haxademic.js/easing-float.js",
              "js/min/haxademic.js/float-buffer.js",
              "js/min/haxademic.js/keyboard-util.js",
              "js/min/haxademic.js/linear-float.js",
              "js/min/haxademic.js/math-util.js",
              "js/min/haxademic.js/mobile-util.js",
              "js/min/haxademic.js/object-pool.js",
              "js/min/haxademic.js/penner.js",
              "js/min/haxademic.js/pointer-pos.js",
              "js/min/haxademic.js/three-scene.js",
              "js/min/app/constants.js",
              "js/min/app/sounds.js",
              "js/min/app/sound-fft.js",
              "js/min/app/microphone-node.js",
              "js/min/app/audio-particles.js",
              "js/min/app/audio-waveforms.js",
              "js/min/app/three-environment.js",
              "js/min/app/app.js",
            ]
        }
      }
    },

    cssmin: {
      options: {
        banner: null, //'/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        report: 'min'
      },
      combine: {
        files: {
          'css/app.min.css': [
            'css/app/normalize.css',
            'css/app/app.css'
          ]
        }
      }
    },

    postcss: {
      options: {
        map: false, // inline sourcemaps
        processors: [
          require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
        ]
      },
      dist: {
        src: 'css/app.min.css'
      }
    },

    clean: ['js/min']

  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');


  // Default task(s).
  grunt.registerTask('default', ['copy', 'babel', 'uglify', 'cssmin', 'postcss:dist', 'clean']);

};
