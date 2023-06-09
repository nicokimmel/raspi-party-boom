module.exports = function (grunt) {
	grunt.initConfig({
		copy: {
			main: {
				files: [
					{ cwd: "src/", expand: true, src: ["**/*", "!public/js/**/*.js"], dest: "dist/" },
					{ cwd: "node_modules/bootstrap/dist/css/", expand: true, src: "bootstrap.min.css", dest: "dist/public/css/" },
					{ cwd: "node_modules/bootstrap/dist/js/", expand: true, src: "bootstrap.min.js", dest: "dist/public/js/" },
					{ cwd: "node_modules/jquery/dist/", expand: true, src: "jquery.min.js", dest: "dist/public/js/" },
					{ cwd: "node_modules/moment/dist/", expand: true, src: "moment.js", dest: "dist/public/js/" }
				]
			}
		},
		uglify: {
			main: {
				files: {
					"dist/public/js/boom.min.js": [
						"src/public/js/**.js"
					]
				}
			}
		},
	});
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.registerTask("default", ["copy", "uglify"]);
}