'use strict';

const browserify = require('browserify'),
    path = require('path'),
    gulp = require('gulp'),
    glob = require('glob'),
    fs = require('fs'),
    chalk = require('chalk'),
    source = require('vinyl-source-stream'),
    tasks = glob.sync('./projects/**/blueprint.json')
        .map((moo) => printBlueprint(moo));

if (tasks.length === 0) {
    console.log('No blueprints defined');
}

gulp.task('gen:js', tasks);

function printBlueprint(blueprintPath) {
    const filePath = path.parse(blueprintPath),
        taskName = filePath.dir.replace(filePath.root, '');
    let blueprint,
        browserifyObj,
        destinationPath;

        // Create the task
    gulp.task(taskName, (done) => {
        try {
            blueprint = JSON.parse(fs.readFileSync(blueprintPath, 'utf8'));
        } catch (e) {
            console.log(`${chalk.red('Failure reading blueprint file: ')} ${chalk.cyan(blueprintPath)}`);
            return done(e);
        }

        if (!blueprint.javascript.enabled) {
            console.log(`${chalk.yellow('Project Skipped: ')} ${chalk.cyan(blueprint.name)}`);
            return done();
        }

        destinationPath = gulp.dest(path.parse(blueprint.javascript.dest).dir);

        browserifyObj = browserify({
            entries: [path.join(filePath.dir, blueprint.javascript.src)],
            debug: blueprint.javascript.debug
        });

        if (blueprint.javascript.minify) {
            browserifyObj = browserifyObj.transform('uglifyify');
        }

        if (blueprint.javascript.dest.endsWith('.js')) {
            blueprint.javascript.dest =
                blueprint.javascript.dest
                    .substring(0, blueprint.javascript.dest.length - 3);
        }

        browserifyObj.bundle()
            .on('error', (e) => {
                console.log(`${chalk.red('Project Bundling Failed: ')} 
                    ${chalk.cyan(blueprint.name)}`);
            })
            .on('end', () => {
                console.log(`${chalk.green('Project Bundling Complete: ')} 
                    ${chalk.cyan(blueprint.name)}`);
            })
            .pipe(source(path.basename(
                `${blueprint.javascript.dest}.bundle.js`)))
            .pipe(destinationPath);

        return true;
    });

    return taskName;
}
