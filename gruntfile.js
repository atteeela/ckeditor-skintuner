module.exports = function( grunt ) {
	"use strict";

	var path = require( "path" ),

		// configuration
		pkg = grunt.file.readJSON( "package.json" ),

		gruntConfiguration,
		mainModuleFileExtension,
		mainModuleFileExtensionLength,
		moduleRootGlobalPropertyName = "MODULE_ROOT";

	gruntConfiguration = {
		bower: grunt.file.readJSON( "bower.json" ),
		pkg: pkg,

		// grunt-contrib-clean
		clean: {
			instrument: "<%= instrument.options.basePath %>"
		},

		// grunt-contrib-copy
		copy: {
			build: {
				files: [ {
					expand: true,
					dest: "build/<%= pkg.version %>",
					src: "libraries/bootstraps/*.js"
				}, {
					cwd: "components/jscolor/",
					expand: true,
					dest: "build/<%= pkg.version %>/components/jscolor",
					src: "**/*"
				}, {
					expand: true,
					flatten: true,
					dest: "build/<%= pkg.version %>/components/requirejs",
					src: "components/requirejs/require.js"
				}, {
					cwd: "public",
					expand: true,
					dest: "build/<%= pkg.version %>",
					src: "**/*"
				} ]
			}
		},

		// grunt-contrib-jshint
		jshint: {
			files: [
				"<%= instrument.files %>",
				"<%= nodeunit.files %>",
				"gruntfile.js"
			],
			options: grunt.file.readJSON( ".jshintrc" )
		},

		// grunt-contrib-nodeunit
		nodeunit: {
			files: [ "tests/**/*Test.js" ]
		},

		// grunt-contrib-watch
		watch: {
			files: [
				"<%= jshint.files %>",
				"public/**/*"
			],
			tasks: [ "beautify", "lint", "build" ]
		},

		// grunt-istanbul
		instrument: {
			files: [ "libraries/**/*.js" ],
			options: {
				basePath: "coverage/instrument/"
			}
		},
		makeReport: {
			src: "<%= storeCoverage.options.dir %>/*.json",
			options: {
				type: "lcov",
				dir: "<%= storeCoverage.options.dir %>",
				print: "detail"
			}
		},
		storeCoverage: {
			options: {
				dir: "coverage/reports/<%= pkg.version %>"
			}
		},

		// grunt-jsbeautifier
		jsbeautifier: {
			files: [ "<%= jshint.files %>" ],
			options: {
				js: grunt.file.readJSON( ".jsbeautifyrc" )
			}
		},

		// grunt-requirejs
		requirejs: {
			compile: {
				options: {
					baseUrl: __dirname,
					generateSourceMaps: true,
					name: "<%= pkg.name %>",
					optimize: "uglify2",
					out: "build/<%= pkg.version %>/<%= pkg.main %>",
					paths: {
						"-": __dirname + "/libraries/scripts",
						"configuration-processor": __dirname + "/node_modules/configuration-processor/libraries/scripts/JsLoader/ConfigurationProcessor",
						"configuration-processor/configuration-processor": __dirname + "/node_modules/configuration-processor/libraries/modules/configuration-processor",
						"data-container": __dirname + "/node_modules/data-container/libraries/scripts/Bender/DataContainer",
						"event-dispatcher": __dirname + "/node_modules/event-dispatcher/libraries/scripts/Bender/EventDispatcher"
					},
					preserveLicenseComments: false
					// uglify2: grunt.file.readJSON( "uglify2.js" )
				}
			}
		}
	};

	mainModuleFileExtension = path.extname( pkg.main );
	mainModuleFileExtensionLength = mainModuleFileExtension.length;

	gruntConfiguration.requirejs.compile.options.paths[ pkg.name ] = pkg.main.substr( 0, pkg.main.length - mainModuleFileExtensionLength );

	grunt.initConfig( gruntConfiguration );

	grunt.loadNpmTasks( "grunt-contrib-clean" );
	grunt.loadNpmTasks( "grunt-contrib-copy" );
	grunt.loadNpmTasks( "grunt-contrib-jshint" );
	grunt.loadNpmTasks( "grunt-contrib-nodeunit" );
	grunt.loadNpmTasks( "grunt-contrib-watch" );
	grunt.loadNpmTasks( "grunt-istanbul" );
	grunt.loadNpmTasks( "grunt-jsbeautifier" );
	grunt.loadNpmTasks( "grunt-requirejs" );

	grunt.registerTask( "register_globals", function( task ) {
		var moduleRoot;

		if ( global.hasOwnProperty( moduleRootGlobalPropertyName ) ) {
			return;
		}

		if ( "coverage" === task ) {
			moduleRoot = __dirname + "/" + grunt.template.process( "<%= instrument.options.basePath %>" );
		} else if ( "test" === task ) {
			moduleRoot = __dirname;
		}

		Object.defineProperty( global, moduleRootGlobalPropertyName, {
			enumerable: true,
			value: moduleRoot
		} );
	} );

	grunt.registerTask( "beautify", [ "jsbeautifier" ] );
	grunt.registerTask( "build", [ "requirejs:compile", "copy:build" ] );
	grunt.registerTask( "cover", [ "register_globals:coverage", "clean:instrument", "instrument", "test", "storeCoverage", "makeReport" ] );
	grunt.registerTask( "lint", [ "jshint" ] );
	grunt.registerTask( "test", [ "register_globals:test", "lint", "nodeunit" ] );

	grunt.registerTask( "default", [ "jsbeautifier", "test" ] );
};
