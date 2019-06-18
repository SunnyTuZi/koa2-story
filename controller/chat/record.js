/**
 * Create by Zwl on 2019/6/13
 * @Description: 聊天
 */

'use strict';

import SelfChat from '../../model/chat/record';
import config from '../../config/config';

class Chat {
    constructor() {
        this.addChatRecord.bind(this);
    }

    async addChatRecord(ctx){
        let {toUserId,userId,content} = ctx.request.body;
        const promise = new Promise( async (resolve,reject)=>{
            await SelfChat.addChatRecord({toUserId,userId,content},(err,docs)=>{
                if(err){
                    ctx.body = {
                        code:0,
                        msg: '服务器错误，发送失败'
                    }
                    reject();
                }else{
                    ctx.body = {
                        code:1,
                        data: docs
                    }
                    resolve();
                }
            });
        });
        await promise;
    }

    async updateRecord(ctx){
        let {userId,toUserId} = ctx.request.body;
        const promise = new Promise( async (resolve,reject)=>{
            await SelfChat.updateRecordStatus({toUserId,userId},(err,docs)=>{
                if(err){
                    ctx.body = {
                        code:0,
                        msg: '服务器错误，接收信息失败'
                    }
                    reject();
                }else{
                    ctx.body = {
                        code:1,
                        data: docs
                    }
                    resolve();
                }
            });
        });
        await promise;
    }

    async getUnReadMsgNum(ctx){
        let form = ctx.query;
        const promise =  new Promise( async (resolve,reject)=> {
            await SelfChat.getUnReadMsgNum(form, (err, docs) => {
                if (err) {
                    ctx.body = {
                        code: 0,
                        msg: '服务器错误，接收信息失败'
                    }
                    reject();
                } else {
                    ctx.body = {
                        code: 1,
                        data: docs
                    }
                    resolve();
                }
            });
        });
        await promise;
    }

    async getUnReadMsgList(ctx){
        let form = ctx.query;
        const promise  = new Promise( async (resolve, reject) => {
            await SelfChat.getUnReadMsgList(form,(err,docs)=>{
                if(err){
                    ctx.body = {
                        code:0,
                        msg: '服务器错误，接收信息失败'
                    }
                    reject();
                }else{
                    ctx.body = {
                        code: 1,
                        data: docs
                    }
                    resolve();
                }
            });
        });
        await promise;

    }

    async getUnReadMsgByUser(ctx){
        let form = ctx.request.body;
        const promise  = new Promise( async (resolve, reject) => {
            await SelfChat.getUnReadMsgByUser(form,(err,docs)=>{
                if(err){
                    ctx.body = {
                        code:0,
                        msg: '服务器错误，接收信息失败'
                    }
                    reject();
                }else{
                    ctx.body = {
                        code: 1,
                        data: docs
                    }
                    resolve();
                }
            });
        });
        await promise;
    }

}

export default new Chat();
