module.exports = function (gulp, plugins, config, isProduction) {
  gulp.task('clean', function () {
    plugins.del([
      config.jsDestinationPath
    ]);
  });
};
