/**
 * Create by Zwl on 2019/4/29
 * @Description: 点赞模型
 */

'use strict';


import mongoose from 'mongoose'


const Schema = mongoose.Schema;

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
    support: function (obj, callback) {
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
    },
    count: function (storyId, callback) {
        return this.aggregate([
            {
                $match:{
                    'storyId': storyId
                }
            },
            {
                $group: {
                    _id: { status: '$status' },
                    count: { $sum: 1}
                }
            }

        ]).exec(
            (err, docs) => {
                if (err) throw err;
                callback(docs);
            }
        )
    },
    statusByUser: function (userId,storyId,callback) {
        return this.findOne({userId,storyId}).exec(
            (err, docs)=>{
                if(err) throw err;
                callback(docs.status);
            }
        )

    }
};

const Support = mongoose.model('Support', supportSchema);

export default Support
