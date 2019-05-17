/**
 * Create by Zwl on 2019/4/29
 * @Description: 点赞模型
 */

'use strict';


import mongoose from 'mongoose'

const Schema = mongoose.Schema;

/**
 * @param userId 点赞用户Id
 * @param storyId 故事ID
 * @param status 收藏状态 0:未点赞和踩/1:点赞/2:踩
 * @param updateDate 更新时间
 * @param createDate 创建
 */

const supportSchema = new Schema({
    storyId: {
        type: Schema.Types.ObjectId,
        ref: 'Story'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        default: 0,
        type: Number
    },
    updateDate:{
      type: Date
    },
    createDate: {type: Date, default: Date.now}
});

supportSchema.statics = {
    /**
     * 点赞
     * @param obj 参数
     * @param callback
     * @returns {Query|void}
     */
    support: function (obj, callback) {
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
};

const Support = mongoose.model('Support', supportSchema);

export default Support
