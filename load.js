var fs = require('fs');
var execSync = require('exec-sync');
var moment = require('moment');

var config = require('./config');
var git = require('./git');

var w = function(path, file) {
    var fullPath = path + '/' + file;

    if (file === '.git') {
        parseLog(path);
    } else if (file.indexOf('.') !== 0) {
        var stat = fs.statSync(fullPath);

        if (stat && stat.isDirectory()) {
            var files = fs.readdirSync(fullPath);

            for (var i = 0 ; i < files.length ; i++) {
                w(fullPath, files[i]);
            }
        }
    }
}

var parseLog = function(path) {
    var log = execSync('cd ' + path + ' && git log').split('\n');
    var email = null;
    var stats = {
        me: 0,
        others: 0,
        authors: {}
    }

    for (var i = 0 ; i < log.length ; i++) {
        if (log[i].indexOf('Date:') === 0) {
            var date = new Date(log[i].substr('Date:'.length).trim());

            if (emails.indexOf(email) > -1) {
                git.addLog(date.getTime(), 'commit', path);
                stats.me++;
            } else {
                stats.others++;
            }

            if (typeof stats.authors[email] === 'undefined') {
                stats.authors[email] = 0;
            }

            stats.authors[email]++;
        } else if (log[i].indexOf('Author:') === 0) {
            email = log[i].replace(/.*\<|\>/gi,'');
        }
    }

    console.log(path + ': ' + JSON.stringify(stats));
    return stats;
};

var path = process.argv[3];
var emails = process.argv[4].split(/[ ,]+/);

w(path, '');
git.fsUtils.write();
//parseLog('/home/ewnd9//git-stats');
