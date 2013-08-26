module.exports = function (grunt) {
    "use strict";

    var defaultTasks;

    defaultTasks = ["jsbeautifier", "test"];

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        // grunt-contrib-clean
        clean: {
            instrument: "<%= instrument.options.basePath %>"
        },

        // grunt-contrib-jshint
        jshint: {
            files: [
                "<%= instrument.files %>",
                "<%= nodeunit.files %>",
                "gruntfile.js"
            ],
            options: grunt.file.readJSON(".jshintrc")
        },

        // grunt-contrib-nodeunit
        nodeunit: {
            files: ["libraries/tests/**/*Test.js"]
        },

        // grunt-contrib-watch
        watch: {
            files: ["<%= jshint.files %>"],
            tasks: defaultTasks
        },

        // grunt-istanbul
        instrument: {
            files: [
                "libraries/modules/*.js",
                "libraries/scripts/**/*.js"
            ],
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
            files: ["<%= jshint.files %>"],
            options: {
                js: grunt.file.readJSON(".jsbeautifyrc")
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-nodeunit");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-istanbul");
    grunt.loadNpmTasks("grunt-jsbeautifier");

    grunt.registerTask("register_globals", function (task) {
        var moduleRoot,
            moduleRootPropertyName = "MODULE_ROOT";

        if (global.hasOwnProperty(moduleRootPropertyName)) {
            return;
        }

        if ("coverage" === task) {
            moduleRoot = __dirname + "/" + grunt.template.process("<%= instrument.options.basePath %>");
        } else if ("test" === task) {
            moduleRoot = __dirname;
        }

        Object.defineProperty(global, moduleRootPropertyName, {
            enumerable: true,
            value: moduleRoot
        });
    });

    grunt.registerTask("beautify", ["jsbeautifier"]);
    grunt.registerTask("cover", ["register_globals:coverage", "clean:instrument", "instrument", "test", "storeCoverage", "makeReport"]);
    grunt.registerTask("lint", ["jshint"]);
    grunt.registerTask("test", ["register_globals:test", "lint", "nodeunit"]);

    grunt.registerTask("default", defaultTasks);
};
