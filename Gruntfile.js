const nunjucks = require('nunjucks');

const buildDir = 'build/';
const srcDir = 'src/';
const dataFile = `data.json`;
const cssOutput = `main.css`;
const indexOutput = `index.html`;

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    const taskConfig = {
        clean: {
            build: ['build/']
        },
        connect: {
            dev: {
                options: {
                    open: true,
                    port: 9000,
                    livereload: 35729,
                    base: buildDir
                }
            }
        },
        stylus: {
            build: {
                options: {
                    compress: false
                },
                files: [{
                    src: ['src/main.styl'],
                    dest: `${buildDir}${cssOutput}`
                }]
            }
        },
        watch: {
            options: {
                livereload: true
            },
            stylus: {
                files: ['src/**/*.styl'],
                tasks: ['stylus:build']
            },
            html: {
                files: [`src/**/*.njk`],
                tasks: [`buildPages`]
            },
            data: {
                files: [`src/**/*.json`],
                tasks: [`buildPages`]
            }
        }
    };

    grunt.initConfig(taskConfig);

    grunt.registerTask('buildPages', () => {
        const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(srcDir));
        env.render(`index.njk`, grunt.file.readJSON(`${srcDir}${dataFile}`), (err, renderedTemplate) => {
            grunt.file.write(`${buildDir}${indexOutput}`, renderedTemplate);
        });
    });

    grunt.registerTask('build', [
        'clean:build',
        'stylus:build',
        'buildPages'
    ]);

    grunt.registerTask('serve', [
        'build',
        'connect:dev',
        'watch'
    ]);
};