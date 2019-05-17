/**
 * Create by Zwl on 2019/5/17
 * @Description: 聊天分组
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

const BubbleGroupchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    groupName: String,
    staff: Number,
    status:{
        type: Number,
        default: 0
    },
    createDate: {type: Date, default: Date.now}
});

BubbleGroupchema.statics = {
    create:function (form,callback) {
        return this.create(form,
            (err,docs) =>{
                callback(err,docs);
            }
        )
    }
}

const BubbleGroup = mongoose.model('Like',BubbleGroupchema);

export default BubbleGroup;
