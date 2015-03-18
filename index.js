/* global: jSmart */
'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
require('jsmart');

function compile(options, data, render) {
	var tpl;
	if (options.templatePath) {
	  jSmart.prototype.getTemplate = function(name) {
	  	return fs.readFileSync(path.join(options.templatePath, name)).toString();
	  };
	}

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-jsmart', 'Streaming not supported'));
			return;
		}

		try {
			tpl = new jSmart(file.contents.toString());
			file.contents = new Buffer(render ? tpl.fetch(getTplData(data)) : tpl.toString());
			this.push(file);
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-jsmart', err, {fileName: file.path}));
		}

		cb();
	});
}

function getTplData (data) {
  var obj = {};
  if (!data) { return obj; }
  if (typeof data === 'object') { return data; }
  if (typeof data === 'string') {
  	fs.stat(data, function(err, stats) {
  		if (stats.isDirectory()) {
  			recurse(data, function (abspath, rootdir, subdir, filename) {
  			  if(path.extname(filename) !== '.json') { return; }
  			  var subObj = obj;
  			  if(subdir) {
  			    subdir.split(path.separator).forEach(function (item) {
  			      item = _.camelCase(item);
  			      subObj[item] = subObj[item] || {};
  			      subObj = subObj[item];
  			    });
  			  }
  			  subObj[_.camelCase(path.basename(filename, '.json'))] = require(abspath);
  			});

  		} else if(stats.isFile()) {
  			if(path.extname(data) === '.json') {
  			  obj[_.camelCase(path.basename(data, '.json'))] = require(data);
  			}
  		}
  	});
  }

  if (Object.keys(obj).length === 0) {
  	this.emit('error', new gutil.PluginError('gulp-jsmart', 'Could not extract any JSON data.', {fileName: file.path}));
  }
  return obj;
}

function recurse(rootdir, callback, subdir) {
  var abspath = subdir ? path.join(rootdir, subdir) : rootdir;
  fs.readdirSync(abspath).forEach(function(filename) {
    var filepath = path.join(abspath, filename);
    if (fs.statSync(filepath).isDirectory()) {
      recurse(rootdir, callback, path.join(subdir || '', filename || ''));
    } else {
      callback(filepath, rootdir, subdir, filename);
    }
  });
};

module.exports = function (data, options) {
	return compile(options, data, true);
};

module.exports.precompile = function (options) {
	return compile(options);
};
