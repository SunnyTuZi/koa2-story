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
    getTopicList:function (form,callback) {
        var condition = [
            {
                $lookup:{
                    from:'topicfollows',
                    let:{tid:'$_id'},
                    pipeline:[
                        {
                            $match:{
                                $expr:{
                                    $and:[
                                        {$eq:['$topicId','$$tid']},
                                        {$eq:['$status',1]}
                                    ]
                                }
                            }
                        }
                    ],
                    as:'tfs'
                }
            },
            {
                $project: {
                    topicName:1,
                    topicInfo:1,
                    topicImg:1,
                    size:{
                        $size:'$tfs'
                    },
                    status:1,
                    createDate: 1,
                    key:'$_id'
                }
            }
        ];
        if(form.status){
            condition.unshift(
                {
                    $match:{
                        status:1
                    }
                }
            )
        }
        if(form.userId){
            condition[1].$lookup.pipeline[0].$match.$expr.$and.push(
                {$eq:['$userId',mongoose.Types.ObjectId(form.userId)]}
            );
        };
        return this.aggregate(condition).exec((err,docs)=>{
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
                    let:{tid:'$_id'},
                    pipeline:[
                        {
                            $match:{
                                $expr: {
                                    $and:[
                                        {$eq:['$topicId','$$tid']},
                                        {$eq:['$status',1]},
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'tfs'
                }
            },
            {
                $project: {
                    topicName: 1,
                    topicInfo: 1,
                    topicImg: 1,
                    followsize:{
                        $size:'$tfs'
                    },
                    followByUser:{
                        $filter:{
                            input:'$tfs',
                            as: 'tf',
                            cond:{$eq:['$$tf.userId',mongoose.Types.ObjectId(form.userId)]}
                        }

                    },
                }
            },
            {
                $addFields:{
                    isfollow:{
                        $size:'$followByUser'
                    }
                }
            }
            ]).exec((err,docs)=>{
            if(err) throw err;
            callback(err,docs[0]);
        });
    },
    getTopicTotal:function (callback) {
        return this.countDocuments({status:1},(err,docs)=>{
            if(err) throw err;
            callback(err,docs);
        });
    },
    updateTopic: function (form,callback) {
        return this.findOneAndUpdate({_id:form._id},{topicName:form.topicName,topicInfo:form.topicInfo,topicImg:form.topicImg,status:form.status},(err,docs)=>{
           if(err) throw err;
           callback(err,docs);
        });
    },
    getTopicRadar: function (callback) {
        var condition = [
            {
              $project:{
                  topicName:1
              }
            },
            {
                $lookup: {
                    from: 'stories',
                    let: {tid: '$_id'},
                    pipeline: [ {
                        $match: {
                            $expr: {
                                $eq: [ '$topicId', '$$tid' ]
                            }
                        },

                    },{
                        $project:{
                          _id:1
                        }
                    }],
                    as: 'story'
                }
            },
            {
                $lookup: {
                    from: 'topicfollows',
                    let: {tid: '$_id'},
                    pipeline: [ {
                        $match: {
                            $expr: {
                                $eq: [ '$topicId', '$$tid' ]
                            }
                        },

                    },{
                        $project:{
                            _id:1
                        }
                    }],
                    as: 'tf'
                }
            },
            {
                $addFields: {
                    storys:{
                        $size:'$story'
                    },
                    tfs:{
                        $size:'$tf'
                    }
                }
            },
            {
                $project:{
                    topicName:1,
                    storys:1,
                    tfs:1
                }
            }
        ];
        return this.aggregate(condition).exec((err,docs)=>{
           if(err) throw err;
           callback(err,docs);
        });
    },
    getHotTopic:function (callback) {
        var condtion = [
            {
                $lookup:{
                    from: 'topicfollows',
                    localField: '_id',
                    foreignField: 'topicId',
                    as: 'tfo'
                }
            },
            {
                $addFields:{
                    fans:{
                        $size:'$tfo'
                    }
                }
            },
            {
                $sort:{
                    fans:-1
                }
            },
            {$limit:5},
            {
                $project:{
                    key:'$_id',
                    topicName:1,
                    topicImg:1,
                    fans:1
                }
            }
        ];
        return this.aggregate(condtion).exec((err,docs)=>{
            if(err) throw err;
            callback(err,docs);
        });
    },
    getTopicListAdmin:function (form,callback) {
        let {page = 1,pageSize = 10} = form;
        page = Number(page)||1;
        pageSize = Number(pageSize)||10;
        var condition = [
            //lookup是连表查询
            {
                $skip:(page-1)*pageSize
            },
            {
                $limit:pageSize
            },
            {
                $lookup:{
                    from:'topicfollows',
                    let:{tid:'$_id'},
                    pipeline:[
                        {
                            $match:{
                                $expr:{
                                    $and:[
                                        {$eq:['$topicId','$$tid']},
                                        {$eq:['$status',1]}
                                    ]
                                }
                            }
                        }
                    ],
                    as:'tfs'
                }
            },
            {
                $project: {
                    topicName:1,
                    topicInfo:1,
                    topicImg:1,
                    size:{
                        $size:'$tfs'
                    },
                    status:1,
                    createDate: 1,
                    key:'$_id'
                }
            }
        ];
        var wheres = {};
        if(form.topicNameKey){
            wheres.topicName = {
                $regex:eval('/'+form.topicNameKey+'/')
            }
        }
        if(form.topicStatus){
            wheres.status = Number(form.topicStatus)
        }
        return this.aggregate(condition).exec((err,docs)=>{
            if(err) throw err;
            this.countDocuments(wheres,(err,total)=>{
                if(err) throw err;
                callback(err,{list:docs,total: total});
            });
        });
    },

}

const Topic = mongoose.model('Topic',Topicchema);

export default Topic;
