module.exports = grunt => {
	require('load-grunt-tasks')(grunt);
	// Project configuration
	grunt.initConfig({
		connect: {
			server: {
				options: {
					port: 5555,
					livereload: 5556,
					base: '..',
					open: 'http://localhost:5555/2019-11-rocketseat/index.html',
					useAvailablePort: false
				}
			}
		},
		watch: {
			js: {
				files: [
					'gruntfile.js',
					'../reveal.js/js/reveal.js'
				]
			},
			css: {
				files: [
					'../reveal.js/css/reveal.css',
					'../reveal.js/css/theme/*.css',
				]
			},
			html: {
				files: './*.html'
			},
			markdown: {
				files: './*.md'
			},
			options: {
				livereload: 5556
			}
		}
	});

	// Serve presentation locally
	grunt.registerTask( 'default', [ 'connect', 'watch' ] );
};
