/**
 * Create by Zwl on 2019/5/7
 * @Description: 收藏模型
 */

'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

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
    likeSave: function (obj, callback) {
        return this.findOne({storyId: obj.storyId, userId: obj.userId},
            (err, doc) => {
                if (err) throw err;
                if (doc) {
                    doc.status = obj.status;
                    doc.save(
                        (err, result) => {
                            if (err) throw err;
                            callback(result);
                        }
                    )
                } else {
                    this.create(obj,
                        (err, result) => {
                            if (err) throw err;
                            callback(result);
                        }
                    )
                }
            }
        )
    }
}

const Like = mongoose.model('Like',likeSchema);

export default Like;
