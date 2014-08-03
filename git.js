var fs = require('fs');
var path = require('./config').filepath;

// Grab config
var config = (function () {
  try {
    fs.statSync(path);
  } catch (err) {
    if (err.code === 'ENOENT') {
      fs.writeFileSync(path, JSON.stringify({ data: [] }), 'utf-8');
    } else {
      throw err;
    }
  }

  return {
    write: function () {
      fs.writeFile(path, JSON.stringify(this.rc), "utf-8", function (err) {
        if (err) throw err;
      });
    },
    rc: JSON.parse(fs.readFileSync(path, 'utf-8'))
  };
}());

var log = {};

var stats = function (args) {
  args = args[0].split(/[ ]+/);

  var path = args.shift();

  var c = args.shift();
  c = (typeof c === 'undefined') ? '' : c;

  log = {
    date: Date.now(),
    command: c,
    details: args,
    path: path
  };

  config.rc.data.push(log);
  config.write();
};

module.exports = stats;
