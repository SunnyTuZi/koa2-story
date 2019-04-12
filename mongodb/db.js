/**
 * Create by Zwl on 2019/4/9
 * @Description: 数据库连接
 */

'use strict';

import mongoose from 'mongoose';
import config from '../config/config';
import chalk from 'chalk';

mongoose.connect(config.dbUrl, { useNewUrlParser : true});
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.once('open' ,() => {
    console.log(
        chalk.green('连接数据库成功')
    );
})

db.on('error', function(error) {
    console.error(
        chalk.red('Error in MongoDb connection: ' + error)
    );
    mongoose.disconnect();
});

db.on('close', function() {
    console.log(
        chalk.red('数据库断开，重新连接数据库')
    );
    mongoose.connect(config.url, {server:{auto_reconnect:true}});
});

