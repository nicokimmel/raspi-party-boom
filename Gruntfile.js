module.exports = function (grunt) {
	grunt.initConfig({
		copy: {
			main: {
				files: [
					{ cwd: "src/", expand: true, src: ["**/*", "!public/js/**/*.js", "!public/css/**/*.css"], dest: "dist/" },
					{ cwd: "node_modules/bootstrap/dist/css/", expand: true, src: "bootstrap.min.css", dest: "dist/public/css/" },
					{ cwd: "node_modules/bootstrap/dist/js/", expand: true, src: "bootstrap.min.js", dest: "dist/public/js/" },
					{ cwd: "node_modules/jquery/dist/", expand: true, src: "jquery.min.js", dest: "dist/public/js/" },
					{ cwd: "node_modules/moment/min/", expand: true, src: "moment.min.js", dest: "dist/public/js/" }
				]
			}
		},
		uglify: {
			js: {
				files: {
					"dist/public/js/boom.min.js": [
						"src/public/js/**.js"
					]
				}
			}
		},
		cssmin: {
			css: {
				files: {
					"dist/public/css/boom.min.css": ["src/public/css/**.css"]
				}
			}
		}
	});
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.registerTask("default", ["copy", "uglify", "cssmin"]);
}