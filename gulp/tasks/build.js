module.exports = function (gulp, plugins, config, isProduction) {
    gulp.task('js', function () {
        gulp.src(config.jsFiles)
            // .pipe(plugins.concat('ng.treeView.js'))
            .pipe(plugins.if(isProduction, plugins.uglify()))
            .pipe(plugins.if(isProduction, plugins.rename({
                suffix: '.min'
            })))
            .pipe(plugins.if(!isProduction, gulp.dest(config.jsDevelopmentPath)))
            .pipe(plugins.if(isProduction, gulp.dest(config.jsDestinationPath)));
    });

    gulp.task('default', function () {
        gulp.start('js');
    });

};
