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
import koajwt from 'koa-jwt'
import config from './config/config'
import socket from  'socket.io';
import http from 'http';
import './until/common';


const app = new Koa();
const server = http.createServer(app.callback());
const io = socket(server);

//监听socket连接
var socketObj = {};
io.on('connection',(socket) =>{
    socket.on('onHandlerGourp',()=>{
        socket.join('onHandlerGourp');
    });
    //上线监听
    socket.on('login',(data)=>{
        socketObj[data._id] = socket.id;
    });
    //私聊
    socket.on('privateChat',(data)=>{
        io.to(socketObj[data.toUserId]).emit('privateChatMsg',data);
    });
});

app._server = server;

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
    ctx.state.io = io;
    return next().catch((err) => {
        if(err.status === 401){
            ctx.status = 401;
            ctx.body = {
                msg: 'token认证失败，请重新登陆'
            }
        }else{
            throw err;
        }
    })
})


app.use(koajwt({
    secret: config.token.serect
}).unless({
    path: [
        /^\/api\/user\/login/,
        /^\/api\/user\/getCode/,
        /^\/api\/public/,
        /^\/api\/story\/getList/,
        /^\/api\/story\/getComentList/,
        /^\/api\/story\/getCommentTotalByStory/,
        /^\/api\/user\/getUserInfo/,
        /^\/api\/topic\/getTopicList/,
        /^\/api\/topic\/getTopicDeatil/,
        /^\/api\/bubble\/getGroupList/,
        /^\/api\/visit\/addRecord/,
        /^\/api\/admin\/login/
    ]
}));
// app.use(verifyToken);

// routes
router(app);

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});
module.exports = app
