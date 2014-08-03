module.exports = {
    filepath: process.env.HOME + '/.gitstats',
    html: process.env.HOME + '/.gitstats.html',
    colors: ['#eee', '#d6e685', '#8cc665', '#44a340', '#1e6823'],
    format: 'MM.DD',
    commands: ['commit'],
    period: 90
};
