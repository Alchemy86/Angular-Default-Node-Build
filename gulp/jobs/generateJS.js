'use strict';

const browserify = require('browserify');
const path = require('path');
const gulp = require('gulp');
const glob = require('glob');
const fs = require('fs');

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function printBlueprint(blueprintPath) {
    const filePath = path.parse(blueprintPath);
    const taskName = filePath.dir.replace(filePath.root, '');
    let blueprint;
    let browserifyObj;

    gulp.task(taskName, (done) => {
        try {
        blueprint = JSON.parse(fs.readFileSync(blueprintPath, 'utf8'));
    } catch (e) {
        console.log(blueprintPath);
        console.log('Failure reading blueprint file: ' + blueprintPath);
        return done(e);
    }

    console.log('Made it');

    if (!blueprint.javascript.enabled) {
        console.log('Skipped: ${blueprint.name}');
        return done();
    }

    browserifyObj = browserify({
        entries: [path.join(filePath.dir, blueprint.javascript.src)],
        debug: blueprint.javascript.debug
    });

        console.log('here now');

    if (blueprint.javascript.minify) {
        browserifyObj = browserifyObj.transform('uglifyify');
    }

    if (blueprint.javascript.dest.endsWith('.js')) {
        blueprint.javascript.dest =
            blueprint.javascript.dest
                .substring(0, blueprint.javascript.dest -3);
    }
    const writer =
        fs.createWriteStream(blueprint.javascript.dest + '.bundle.js');

    ensureDirectoryExistence(writer.path);

    browserifyObj.bundle()
        .on('error', function(e) {
            console.log(e);
        })
        .pipe(writer);
    });

return taskName;
};

const tasks = glob.sync('./projects/**/blueprint.json')
    .map((path) => printBlueprint(path));

if (tasks.length === 0) {
    console.log('No blueprints defined');
}

gulp.task('gen:js', tasks);
