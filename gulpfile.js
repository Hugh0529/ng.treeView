var gulp = require('gulp'),
  config = require('./gulp/config')(),
  plugins = require('gulp-load-plugins')(),
  gulpTaskList = require('fs').readdirSync('./gulp/tasks/'),
  argv = require('yargs').argv;

plugins.del = require('del');

var isProduction = argv.env === 'production',
  js = argv.js;

gulpTaskList.forEach(function (taskfile) {
    require('./gulp/tasks/' + taskfile)(gulp, plugins, config, isProduction, js);
});
