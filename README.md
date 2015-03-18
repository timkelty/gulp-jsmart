# gulp-jsmart
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

> [jSmart](https://github.com/umakantp/jsmart) plugin for [gulp](https://github.com/wearefractal/gulp), based on [gulp-template](https://github.com/sindresorhus/gulp-template) and [grunt-jsmart](https://github.com/hereandnow/grunt-jsmart)

## Install

```shell
npm install --save-dev gulp-jsmart
```

## Usage

### `gulpfile.js`

This example shows how one might convert glob of templates, and rename them with [gulp-rename](https://www.npmjs.com/package/gulp-rename)

```js
var gulp = require('gulp');
var jsmart = require('gulp-jsmart');
var rename = require('gulp-rename');
var options = {
  templatePath: 'app/templates/',
};

gulp.task('default', function () {
	return gulp.src('src/templates/*.tpl')
		.pipe(jsmart('src/data/', options))
		.pipe(rename({extname: '.html'}))
		.pipe(gulp.dest('dist'));
});
```

## API

### jsmart(data, options)

#### data
Type: `String`|`Object`
Default value: undefined

A value where you can pass your data as

1. Object
2. File
3. Directory

If you pass your data as JSON-File or Directory Containing JSON-Files, the `first Level` in Object-Hierarchy is the Name of the JSON-File (Underscores, Hyphens etc. are converted to camelCase!).

E.g. Your Filename is `book-store.json` with the content

    {
       "greeting": "Hi, there are some JScript books you may find interesting:"
    }

you must use it in your template like this:

    <h1>{$bookStore.greeting}</h1>

#### options
Type: `Object`

##### options.templatePath
Type: `String`
Default value: undefined

A string value where you can define a Path in your Project where jSmart should load Templates for Inheritance.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-jsmart
[npm-image]: https://badge.fury.io/js/gulp-jsmart.png

[travis-url]: http://travis-ci.org/timkelty/gulp-jsmart
[travis-image]: https://secure.travis-ci.org/timkelty/gulp-jsmart.png?branch=master

[coveralls-url]: https://coveralls.io/r/timkelty/gulp-jsmart
[coveralls-image]: https://coveralls.io/repos/timkelty/gulp-jsmart/badge.png

[depstat-url]: https://david-dm.org/timkelty/gulp-jsmart
[depstat-image]: https://david-dm.org/timkelty/gulp-jsmart.png
