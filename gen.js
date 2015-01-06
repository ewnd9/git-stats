var fs = require('fs');
var moment = require('moment');

var config = require('./config');
var jade = require('jade');

var path = config.filepath;
var htmlPath = config.html;

var fmt = 'DD.MM.YYYY';
var period = config.period;

fs.statSync(path);
var data = JSON.parse(fs.readFileSync(path, 'utf-8'))['data'];

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

var currEvents = [];

var events = [];
events.push(curr);

for (var i = 0 ; i < period ; i++) {
  date.add(1, 'day');

  var curr = date.format(fmt);
  var size = commits[curr] ? commits[curr].length : 0;
  var color = config.colors[Math.min(size, config.colors.length - 1)];

  currEvents.push({
    color: color,
    date: date.format(config.format)
  });

  if ((i + 1) % 5 == 0) {
    currEvents = [];
    events.push(currEvents);
  }
}

var swig  = require('swig');

var html = swig.renderFile(__dirname + '/stats-template.html', {
  events: events
});

fs.writeFile(htmlPath, html, "utf-8", function (err) {
  if (err) throw err;
});

var open = require('open');
open(htmlPath);
