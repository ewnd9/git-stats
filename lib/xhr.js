/*global require exports */
/**
  Copyright (C) 2011 by Josh Perez <josh@goatslacker.com>

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
  */

/**
  @author Josh Perez <josh@goatslacker.com>
  @version 1.0
  */

var http = require("http");

/**
  Performs an http request

  @param {Object} options { host: <server_name>, port: <server_port>, method: <request_method>, path: <url> }
  @param {Function} callback runs after operation has completed
  */
var doXHR = function (options, callback, data) {
  var req = http.request(options, function (res) {
    res.setEncoding('utf8');
    res.responseText = "";

    res.on('data', function (chunk) {
      res.responseText += chunk;
    });

    res.on('end', function () {
      callback && callback(res);
    });
  });

  if (data) {
    req.write(JSON.stringify(data));
  }

  req.end();
};

/**
  Loads pre-configured host/port
  Useful if you're making many XHR requests to a single place

  @param {string} host the domain name to query
  @param {integer} port
  @returns {Object} get, post, put
  */
exports.load = function (host, port) {
  var options = {
    host: host,
    port: port || 80,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  };

  return function (path, headers) {
    headers = headers || {};

    options.path = path;

    // override headers if they exist
    Object.keys(headers).forEach(function (header) {
      options.headers[header] = headers[header];
    });

    return {
      get: function (callback) {
        options.method = "GET";
        doXHR(options, callback);
      },

      post: function (data, callback) {
        options.method = "POST";
        doXHR(options, callback, data);
      },

      put: function (data, callback) {
        options.method = "PUT";
        doXHR(options, callback, data);
      },

      del: function (data, callback) {
        options.method = "DELETE";
        doXHR(options, callback, data);
      }
    };
  };

};

/**
  Returns direct access to XHR function
  */
exports.xhr = doXHR;