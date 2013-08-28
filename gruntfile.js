module.exports = function( grunt ) {
	"use strict";

	var // node modules
	path = require( "path" ),

		// configuration
		pkg = grunt.file.readJSON( "package.json" ),

		baseScriptsDirectory = "scripts",
		mainModuleFileExtension,
		mainModuleFileExtensionLength,
		mainModulePathRelativeToBaseScriptsDirectory,
		moduleRootGlobalPropertyName = "MODULE_ROOT";

	mainModulePathRelativeToBaseScriptsDirectory = path.relative( baseScriptsDirectory, pkg.main );
	mainModuleFileExtension = path.extname( mainModulePathRelativeToBaseScriptsDirectory );
	mainModuleFileExtensionLength = mainModuleFileExtension.length;
	mainModulePathRelativeToBaseScriptsDirectory = mainModulePathRelativeToBaseScriptsDirectory.substr( 0, mainModulePathRelativeToBaseScriptsDirectory.length - mainModuleFileExtensionLength );
	mainModulePathRelativeToBaseScriptsDirectory = mainModulePathRelativeToBaseScriptsDirectory.replace( path.sep, "/" );

	grunt.initConfig( {
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
					filter: 'isFile',
					dest: "build/<%= pkg.version %>",
					src: baseScriptsDirectory + "/*.js"
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
			files: [ "<%= jshint.files %>" ],
			tasks: [ "beautify", "lint", "build" ]
		},

		// grunt-istanbul
		instrument: {
			files: [ baseScriptsDirectory + "/**/*.js" ],
			options: {
				basePath: "coverage/instrument/"
			}
		},
		storeCoverage: {
			options: {
				dir: "coverage/reports/<%= pkg.version %>"
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
					baseUrl: baseScriptsDirectory,
					generateSourceMaps: true,
					name: mainModulePathRelativeToBaseScriptsDirectory,
					optimize: "uglify2",
					out: "build/<%= pkg.version %>/<%= pkg.main %>",
					paths: {
						"Bender/EventDispatcher/Event": __dirname + "/node_modules/event-dispatcher/scripts/EventDispatcher/Event",
						"Bender/EventDispatcher/EventAggregator": __dirname + "/node_modules/event-dispatcher/scripts/EventDispatcher/EventAggregator",
						"Bender/EventDispatcher/EventDispatcher": __dirname + "/node_modules/event-dispatcher/scripts/EventDispatcher/EventDispatcher"
					},
					preserveLicenseComments: false
				}
			}
		}
	} );

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
