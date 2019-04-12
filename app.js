/**
 * Create by Zwl on 2019/4/9
 * @Description: 入口文件
 */

'use strict';

import Koa from 'koa';
import views from 'koa-views'
import json from 'koa-json'
import onerror from 'koa-onerror'
import koaBody from 'koa-body'
import logger from 'koa-logger'
import './mongodb/db'
import router from './routes/index'

const app = new Koa();

// error handler
onerror(app)

// middlewares
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFieldsSize: 10 * 1024 * 1024,
        multipart: true
    }
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
})

// routes
router(app);

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
