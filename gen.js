var fs = require('fs');
var moment = require('moment');

var config = require('./config');

var path = config.filepath;
var htmlPath = config.html;

var fmt = 'DD.MM.YYYY';
var period = config.period;

fs.statSync(path);
var data = JSON.parse(fs.readFileSync(path, 'utf-8'))['data'];

var html = '<table><tr>';
var commits = {};

for (var i = 0 ; i < data.length ; i++) {
    if (data[i]['command'].indexOf('commit') === 0) {
        var date = moment(data[i]['date']).format(fmt);
        if (typeof commits[date] === 'undefined') {
            commits[date] = [];
        }

        commits[date].push(data[i]);
    }
}

var date = moment().subtract(period, 'day');
for (var i = 0 ; i < period ; i++) {
    date.add(1, 'day');

    var curr = date.format(fmt);
    var size = commits[curr] ? commits[curr].length : 0;
    var color = config.colors[Math.min(size, config.colors.length - 1)];

    html += '<td ' + 'style="background-color: ' + color + '">' + date.format(config.format) +  '</td>';

    if ((i + 1) % 5 == 0) {
        html += '</tr>\n<tr>';
    }
}

html += '</tr></table>';

fs.writeFile(htmlPath, html, "utf-8", function (err) {
  if (err) throw err;
});

var open = require('open');
open(htmlPath);

console.log(html);
