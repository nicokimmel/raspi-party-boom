module.exports = function(grunt) {	
	grunt.initConfig({
		copy: {
			main: {
				files: [
                    {cwd: "src/", expand: true, src: ["**/*"], dest: "dist/"},
					{cwd: "node_modules/bootstrap/dist/css/", expand: true, src: "bootstrap.min.css", dest: "dist/public/css/"},
					{cwd: "node_modules/bootstrap/dist/js/", expand: true, src: "bootstrap.min.js", dest: "dist/public/js/"},
                    {cwd: "node_modules/jquery/dist/", expand: true, src: "jquery.min.js", dest: "dist/public/js/"},
				]
			}
		}
	});
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.registerTask("default", ["copy"]);
}