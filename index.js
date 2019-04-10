require('babel-core/register')({
    presets: ['es2015-node5', 'stage-3']
});
var app  = require('./app');

module.exports = app;
