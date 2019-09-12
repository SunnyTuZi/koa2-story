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
                            //加入分组
                            socket.on('join',(data) =>{
                                data.id = socket.id;
                                data.type = 2;
                                group.emit('joinCall', data);
                                ctx.state.io.to('onHandlerGourp').emit('changeGroupList',{groupId:docs._id,num:1});
                            });
                            //发送信息
                            socket.on('sendMsg', (data) => {
                                data.id = socket.id;
                                data.type = 1;
                                group.emit('receiveMsg', data);
                            });
                            //用户离开
                            socket.on('leaveGroup', (data) => {
                                group.emit('receiveMsg', {type:3,username:data.username});
                                ctx.state.io.to('onHandlerGourp').emit('changeGroupList',{groupId:docs._id,num:-1});
                            });
                        });
                        //创建后，延迟关闭
                        setTimeout(()=>{
                            group.disconnect?group.disconnect(true):'';
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
                        for (let i = 0; i < docs.length; i ++) {
                            var item = docs[i];
                            ctx.state.io.of(item._id).clients((error, clients) => {
                                if (error) throw error;
                                item.size = clients.length;
                            });
                        }

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
