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
    },
    getLikeByUser:function (obj,callback) {
        var condition = [
            //lookup是连表查询
            {
              $match:{
                  status:1,
                  userId:mongoose.Types.ObjectId(obj.userId)
              }
            },
            {
                $lookup:{
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup:{
                    from: 'supports',
                    let:{sid:'$storyId'},
                    pipeline:[
                        {
                            $match: {
                                $expr:{
                                  $eq:['$storyId','$$sid']
                                }

                            }
                        }
                    ],
                    as: 'support'
                }
            },
            {
                $lookup:{
                    from: 'comments',
                    let:{sid:'$storyId'},
                    pipeline:[
                        {
                            $match: {
                                $expr:{
                                    $eq:['$storyId','$$sid']
                                }

                            }
                        }
                    ],
                    as: 'comment'
                }
            },
            {
                $lookup:{
                    from: 'stories',
                    let:{sid:'$storyId'},
                    pipeline:[
                        {
                            $match: {
                                $expr:{
                                    $eq:['$_id','$$sid']
                                }

                            }
                        }
                    ],
                    as: 'storys'
                }
            },
            //拆分字符，将user数组变成对象
            { $unwind:"$user" },
            { $unwind:"$storys" },
            //重新定义一些字段
            {
                $project:{
                    goods:{
                        $filter:{
                            input:'$support',
                            as: 'good',
                            cond:{$eq:['$$good.status', 1]}
                        }

                    },
                    bads:{
                        $filter:{
                            input:'$support',
                            as: 'bad',
                            cond:{$eq:['$$bad.status', 2]}
                        }

                    },
                    supportByUser:{
                        $filter:{
                            input:'$support',
                            as: 'sup',
                            cond: {
                                $and: [
                                    {$eq: [ '$$sup.userId', mongoose.Types.ObjectId(obj.userId) ]},
                                    {$eq: [ '$$sup.status', 1 ]},
                                ]
                            }
                        }
                    },
                    userId:'$user',
                    storys:1,
                    storyName: '$storys.storyName',
                    storyContent: '$storys.storyContent',
                    createDate: '$storys.createDate',
                    comment:1,
                    likeByUser:'1',
                    _id:'$storys._id'
                }
            },
            //添加新的字段
            {
                $addFields:{
                    bad:{ $size:'$bads.status'},
                    good:{ $size: '$goods.status'},
                    coms:{ $size:'$comment' }
                }
            },
            //定义需要的字段
            {
                $project: {
                    'userId._id':1,
                    'userId.uaername':1,
                    'userId.head':1,
                    'userId.autograph':1,
                    'userId.sex':1,
                    storyName: 1,
                    storyContent: 1,
                    createDate: 1,
                    bads:'$bad',
                    goods:'$good',
                    supportByUser:{
                        $size:'$supportByUser'
                    },
                    likeByUser:1,
                    coms:1,
                    _id:1
                }
            }
        ];
        return this.aggregate(condition).exec((err,docs)=>{
            if(err) throw err;
            callback(err,docs);
        });
    }
}

const Like = mongoose.model('Like',likeSchema);

export default Like;
