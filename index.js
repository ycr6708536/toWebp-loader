// Copyright (C) 2016 Max Riveiro <24732077@qq.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var imagemin = require('imagemin');
var imageminWebp = require('imagemin-webp');
var loaderUtils = require('loader-utils');
var mime = require("mime");

module.exports = function(content) {
  this.cacheable && this.cacheable();
  if (!this.emitFile) throw new Error("emitFile is required from module system");

  var callback = this.async();
  var called = false;

  var query = loaderUtils.parseQuery(this.query);
  // save file path  as source file hash
  var url = loaderUtils.interpolateName(this, query.name || "[hash].[ext]", {
    content: content,
    regExp: query.regExp
  });
  var webpUrl = url.substring(0, url.lastIndexOf('.')) + '.webp';

  if (query.limit) {
    limit = parseInt(query.limit, 10);
  }
  var mimetype = query.mimetype || query.minetype || mime.lookup(this.resourcePath);
  if (limit <= 0 || content.length < limit) {
    return "module.exports = " + JSON.stringify("data:" + (mimetype ? mimetype + ";" : "") + "base64," + content.toString("base64"));
  }

  var options = {
    preset: query.preset || 'default',
    quality: query.quality || 75,
    alphaQuality: query.alphaQuality || 100,
    method: query.method || 1,
    sns: query.sns || 80,
    autoFilter: query.autoFilter || false,
    sharpness: query.sharpness || 0,
    lossless: query.lossless || false,
    bypassOnDebug: query.bypassOnDebug || false,
  };

  if (query.size) {
    options.size = query.size;
  }

  if (query.filter) {
    options.filter = query.filter;
  }

  if (this.debug === true && options.bypassOnDebug === true) {
    return "module.exports = __webpack_public_path__ + " + JSON.stringify(url) + ";";
  } else {
    imagemin.buffer(content, { plugins: [imageminWebp(options)] }).then(file => {
      this.emitFile(url, content);
      this.emitFile(webpUrl, file);
      callback(null, "module.exports = __webpack_public_path__ + " + JSON.stringify(url) + ";");
    }).catch(err => {
      callback(err);
    });
  }
};

module.exports.raw = true;