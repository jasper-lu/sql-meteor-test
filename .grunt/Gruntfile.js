module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			sass: {
				files: ['../client/css/*.{scss,sass}', '../packages/**/*.{scss,sass}', '../packages/bitters/base/*.scss', '../*.scss'],
				tasks: ['sass:dist']
			}
		},
		sass: {
			dist: {
				src: '../client/css/application.scss',
				dest: '../client/css/application.css',
				options: {
					includePaths: ['../packages/'],
					outputStyle: 'expanded',
					sourceComments: 'none'
				}
			}
		}
	});
	grunt.registerTask('default', ['sass:dist', 'watch']);
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
};
