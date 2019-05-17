/**
 * Create by Zwl on 2019/5/7
 * @Description: 收藏模型
 */

'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * @param userId 收藏用户Id
 * @param storyId 故事ID
 * @param status 收藏状态 1:收藏/0:未收藏
 * @param createDate 发表时间
 */

const likeSchema = new Schema({
    userId:{
       type: Schema.Types.ObjectId,
       ref: 'User'
    },
    storyId:{
        type: Schema.Types.ObjectId,
        ref: 'Story'
    },
    status:{
        type: Number,
        default: 0
    },
    createDate: {type: Date, default: Date.now}
});

likeSchema.statics = {
    /**
     * 收藏故事
     * @param obj 参数
     * @param callback
     * @returns {Query|void}
     */
    likeSave: function (obj, callback) {
        return this.findOne({storyId: obj.storyId, userId: obj.userId},
            (err, doc) => {
                if (err) throw err;
                if (doc) {
                    doc.status = obj.status;
                    doc.save(
                        (err, result) => {
                            callback(err,result);
                        }
                    )
                } else {
                    this.create(obj,
                        (err, result) => {
                            callback(err,result);
                        }
                    )
                }
            }
        )
    }
}

const Like = mongoose.model('Like',likeSchema);

export default Like;
