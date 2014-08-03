var fs = require('fs');

var config = require('./config');
var path = config.filepath;

var fsUtils = (function () {
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

var addLog = function(date, command, path) {
    var log = {
        date: date,
        command: command,
        path: path
    };

    fsUtils.rc.data.push(log);
};

var stats = function (args) {
    args = args[0].split(/[ ]+/);

    var path = args.shift();

    var c = args.shift();
    c = (typeof c === 'undefined') ? '' : c;

    if (config.commands.indexOf(c) > -1) {
        addLog(Date.now(), c, path);
        fsUtils.write();
    }
};

module.exports = {
    stats: stats,
    addLog: addLog,
    fsUtils: fsUtils
};
