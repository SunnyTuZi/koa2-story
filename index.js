/**
 * Create by Zwl on 2019/4/8
 * @Description: 入口文件-支持es6
 */

'use strict';

require('babel-core/register')({
    presets: ['es2015-node5', 'stage-3']
});
var app  = require('./app');

module.exports = app;
