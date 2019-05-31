/**
 * Create by Zwl on 2019/5/17
 * @Description: 聊天
 */

'use strict';

import BubbleGroup from '../../model/bubble/group';
import GroupChat from '../../model/bubble/chatGroup';
import config from '../../config/config';

class Chat {
    constructor() {
        this.createChatGroup.bind(this);
        this.getGroupList.bind(this);
        this.addChatRecord.bind(this);
    }
    async createChatGroup(ctx) {
        let {userId, groupName, staff} = ctx.request.body;
        const promise = new Promise(async (resolve, reject) => {
            await BubbleGroup.createGroup({userId, groupName, staff},
                (err, docs) => {
                    if (err) {
                        ctx.body = {
                            code: 0,
                            msg: '服务器错误，创建失败'
                        }
                        reject();
                    } else {
                        ctx.body = {
                            code: 1
                        }
                        //创建聊天分组
                        let group = ctx.state.io.of('/' + docs._id);
                        group.on('connection', (socket) => {
                            socket.on('sendMsg', (data) => {
                                data.id = socket.id;
                                group.emit('receiveMsg', data);
                            })
                        });
                        //创建后，延迟关闭
                        setTimeout(()=>{
                            group.disconnect();
                        },config.groupInHour*60*60*1000);
                        resolve();
                    }
                }
            )
        });
        await promise;
    }

    async getGroupList(ctx){
        const promise = new Promise(async (resolve, reject) => {
            await BubbleGroup.getList(
                (err, docs) => {
                    if (err) {
                        ctx.body = {
                            code: 0,
                            msg: '服务器错误，获取列表失败'
                        }
                        reject();
                    } else {
                        ctx.body = {
                            code: 1,
                            data: docs
                        }
                        resolve();
                    }
                }
            )
        });
        await promise;
    }

    async addChatRecord(ctx){
        let {groupId,userId,content} = ctx.request.body;
        const promise = new Promise( async (resolve,reject)=>{
            await GroupChat.addChatRecord({groupId,userId,content},(err,docs)=>{
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
}

export default new Chat();
