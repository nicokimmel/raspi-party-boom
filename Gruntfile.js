module.exports = function(grunt) {	
	grunt.initConfig({
		copy: {
            options: {
                ignore: ['**/*.ts']
            },
			main: {
				files: [
                    {cwd: "src/", expand: true, src: ["**/*", "!public/ts/**"], dest: "dist/"},
					{cwd: "node_modules/bootstrap/dist/css/", expand: true, src: "bootstrap.min.css", dest: "dist/public/css/"},
					{cwd: "node_modules/bootstrap/dist/js/", expand: true, src: "bootstrap.min.js", dest: "dist/public/js/"},
				]
			}
		},
        ts: {
            options: {
                module: 'commonjs',
                target: 'es6',
                sourceMap: true,
                rootDir: 'src/public/ts'
            },
            default: {
                src: ['src/public/ts/**/*.ts'],
                outDir: 'dist/public/js'
            }
        },
        clean: {
            js: "dist/public/js/*.js.map",
            ts: "tscommand*"
        }
	});
	grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.registerTask("default", ["copy", "ts", "clean"]);
}