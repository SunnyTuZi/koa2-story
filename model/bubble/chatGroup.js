/**
 * Create by Zwl on 2019/5/28
 * @Description: 分组聊天记录
 */

'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * @param userId 收藏用户Id
 * @param groupName 分组名字
 * @param status 收藏状态 1:收藏/0:未收藏
 * @param createDate 发表时间
 */

const GroupChatchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    groupId:{
        type: Schema.Types.ObjectId,
        ref: 'BubbleGroup'
    },
    content: String,
    status:{
        default: 0,
        type: Number
    },
    createDate: {type: Date, default: Date.now}
});

GroupChatchema.statics = {
    addChatRecord:function (form,callback) {
        return this.create(form,(err,docs)=>{
            callback(err,docs);
        });
    }
}

const GroupChat = mongoose.model('GroupChat',GroupChatchema);

export default GroupChat;
