/**
 * Create by Zwl on 2019/6/13
 * @Description: 聊天记录
 */

'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * @param userId 发送信息用户Id
 * @param toUserId 接受信息用户Id
 * @param content 信息内容
 * @param status 信息状态 0:未读/1:已读/2:删除
 * @param createDate 发表时间
 */

const Chatchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    toUserId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: String,
    status:{
        default: 0,
        type: Number
    },
    createDate: {type: Date, default: Date.now}
});

Chatchema.statics = {
    addChatRecord:function (form,callback) {
        return this.create(form,(err,docs)=>{
            callback(err,docs);
        });
    },
    updateRecordStatus:function (form,callback) {
        return this.findOneAndUpdate({toUserId:form.toUserId,status:0},{status:1},(err,docs)=>{
            callback(err,docs);
        });
    }
}

const SelfChat = mongoose.model('SelfChat',Chatchema);

export default SelfChat;
