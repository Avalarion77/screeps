module.exports = function (grunt) {

    // Pull defaults (including username and password) from .screeps.json
    const config = require('./.screeps.json');
    if(!config.branch) {
        config.branch = 'sim'
    }

    if(!config.ptr) {
        config.ptr = false
    }

    // Allow grunt options to override default configuration
    const branch = grunt.option('branch') || config.branch;
    const email = grunt.option('email') || config.email;
    const password = grunt.option('password') || config.password;
    const ptr = grunt.option('ptr') ? true : config.ptr;
    const private_directory = grunt.option('private_directory') || config.private_directory;


    let currentDate = new Date();
    grunt.log.subhead('Task Start: ' + currentDate.toLocaleString());
    grunt.log.writeln('Branch: ' + branch);

    // Load needed tasks
    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-file-append');
    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks("grunt-rsync");
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-stripcomments');
    grunt.loadNpmTasks("grunt-remove-logging");

    grunt.initConfig({
        // Push all files in the dist folder to screeps
        screeps: {
            options: {
                email: email,
                password: password,
                branch: branch,
                ptr: ptr
            },
            dist: {
                src: ['dist/*.js']
            }
        },


        // Combine groups of files to reduce the calls to 'require'
        concat: {
            // Merge together additions to the default game objects into one file
            extends: {
                src: ['dist/extend_*.js'],
                dest: 'dist/_extensions_packaged.js',
            },

            // Merge ScreepsOS into a single file in the specified order
            sos: {
                options: {
                    banner: "var skip_includes = true\n\n",
                    separator: "\n\n\n",
                },
                // Do not include console! It has to be redefined each tick
                src: ['dist/sos_config.js', 'dist/sos_interrupt.js', 'dist/sos_process.js', 'dist/sos_scheduler.js', 'dist/sos_kernel.js'],
                dest: 'dist/_sos_packaged.js',
            }
        },

        // Copy all source files into the dist folder, flattening the folder
        // structure by converting path delimiters to underscores
        copy: {
            // Pushes the game code to the dist folder so it can be modified before
            // being send to the screeps server.
            screeps: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: '**',
                    dest: 'dist/',
                    filter: 'isFile',
                    rename: function (dest, src) {
                        // Change the path name utilize underscores for folders
                        return dest + src.replace(/\//g,'_');
                    }
                }]
            }
        },


        // Copy files to the folder the client uses to sink to the private server.
        // Use rsync so the client only uploads the changed files.
        rsync: {
            options: {
                args: ["--verbose", "--checksum"],
                exclude: [".git*"],
                recursive: true
            },
            private: {
                options: {
                    src: './dist/',
                    dest: private_directory,
                }
            }
        },

        shell: {
            ps: {
                options: {
                    stdout: true
                },
                command: 'powershell ./shell.ps1'
            }
        },

        // Add version variable using current timestamp.
        file_append: {
            versioning: {
                files: [
                    {
                        append: "\nglobal.SCRIPT_VERSION = "+ currentDate.getTime() + ";\n",
                        input: 'dist/version.js',
                    }
                ]
            }
        },

        // Clean the dist folder.
        clean: {
            'dist': ['dist']
        },

        // Apply code styling
        jsbeautifier: {
            modify: {
                src: ["src/**/*.js"],
                options: {
                    config: '.jsbeautifyrc'
                }
            },
            verify: {
                src: ["src/**/*.js"],
                options: {
                    mode: 'VERIFY_ONLY',
                    config: '.jsbeautifyrc'
                }
            }
        },

        comments: {
            dist: {
                // Target-specific file lists and/or options go here.
                options: {
                    singleline: true,
                    multiline: true,
                    keepSpecialComments: false
                },
                src: [ 'dist/*.js'] // files to remove comments from
            }
        },

        removelogging: {
            dist: {
                src: "dist/**/*.js" // Each file will be overwritten with the output!
            }
        }
    });

    // Combine the above into a default task
    grunt.registerTask('build',         ['clean', 'copy:screeps', 'comments:dist', 'file_append']);
    grunt.registerTask('deploy-live',   ['screeps']);
    grunt.registerTask('private',       ['rsync:private']);
    grunt.registerTask('private-windows', ['shell:ps']);
    grunt.registerTask('test',          ['jsbeautifier:verify']);
    grunt.registerTask('pretty',        ['jsbeautifier:modify']);

    grunt.registerTask('deploy', 'deploys current version on server', function(){
        grunt.task.run('build', 'deploy-live');
    });
    grunt.registerTask('deploy-local', 'deploys current version on server', function(){
        grunt.task.run('build', 'private-windows');
    });
};