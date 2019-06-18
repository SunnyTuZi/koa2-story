/**
 * Create by Zwl on 2019/6/14
 * @Description: 话题模型
 */

'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * @param topicImg 话题图片
 * @param topicName 话题名称
 * @param topicInfo 话题简介
 * @param status 话题状态 1:显示/0:隐藏
 * @param createDate 发表时间
 */

const Topicchema = new Schema({
    topicImg:String,
    topicName:String,
    topicInfo:String,
    status:{
      default: 1,
      type: Number
    },
    createDate: {type: Date, default: Date.now}
});

Topicchema.statics = {
    addTopic:function (form,callback) {
        return this.create(form,(err,docs)=>{
            if(err) throw err;
            callback(err,docs);
        });
    },
    getTopicList:function (callback) {
        return this.aggregate([
            {
                $match: {
                    status:1
                }
            },
            {
                $group:{
                    _id:{
                        _id:'$_id',
                        topicName:'$topicName',
                        topicImg:'$topicImg',
                        topicInfo:'$topicInfo',
                        size:{
                            $sum:'$status'
                        }
                    }
                }
            }
            // {
            //     $lookup:{
            //         from: 'topicfollows',
            //         localField: '_id',
            //         foreignField: 'topicId',
            //         as: 'tf'
            //     }
            // },
            // {
            //     $addFields: {
            //         size:{
            //             $size:'$tf'
            //         }
            //     }
            // },
            // {
            //     $project:{
            //         follows:{
            //             $filter: {
            //                 input: '$tf',
            //                 as: 'tfs',
            //                 cond: {$eq: [ '$$tfs.status', 1 ]}
            //             }
            //         },
            //         _id:1,
            //         topicImg:1,
            //         topicName:1,
            //         topicInfo:1,
            //     }
            // },
            // {
            //     $addFields:{
            //         size:{
            //             $size:'$follows'
            //         }
            //     }
            // }
        ]).exec((err,docs)=>{
            if(err) throw err;
           callback(err,docs);
        });
    },
    getTopicDeatil:function (form,callback) {
        return this.aggregate([
            {
                $match:{
                    _id:mongoose.Types.ObjectId(form.topicId),
                    status:1
                }
            },{
                $lookup:{
                    from: 'topicfollows',
                    localField: '_id',
                    foreignField: 'topicId',
                    as: 'tf'
                }
            },
            {
                $project: {
                    follows: {
                        $filter: {
                            input: '$tf',
                            as: 'tfs',
                            cond: {$eq: [ '$$tfs.status', 1 ]}
                        }
                    },
                    followByUser:{
                        $filter: {
                            input: '$tf',
                            as: 'fbs',
                            cond: {
                                $or:[{$eq: ['$$fbs.status', 1 ]},{$eq: ['$$fbs.userId', mongoose.Types.ObjectId(form.userId) ]}]
                            }
                        }
                    },
                    topicName: 1,
                    topicInfo: 1,
                    topicImg: 1
                }
            },
            {
                $addFields:{
                    followsize:{
                        $size:'$follows'
                    },
                    isfollow:{
                        $size:'$followByUser'
                    }
                }
            }
            ]).exec((err,docs)=>{
            if(err) throw err;
            callback(err,docs[0]);
        });
    }
}

const Topic = mongoose.model('Topic',Topicchema);

export default Topic;
