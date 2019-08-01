/**
 * Create by Zwl on 2019/4/28
 * @Description:
 */

'use strict';


'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema

/**
 * @param userId 发表用户Id
 * @param storyName 故事名称
 * @param storyContent 故事内容
 * @param status 故事的状态 1:在线/0:违规/2:软删除
 * @param topicId 话题ID
 * @param createDate 发表时间
 */

const storySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    storyName: String,
    storyContent: String,
    status:{
      default: 1,
      type: Number
    },
    topicId:{
        type: Schema.Types.ObjectId,
        ref: 'Topic'
    },
    createDate: {type: Date, default: Date.now}
});

storySchema.statics = {
    /**
     * 添加故事
     * @param form 表单数据
     * @param callback
     * @returns {form}
     */
    addStory: function(form,callback){
        return this.create(form,(err,docs)=>{
            callback(err,docs);
        });
    },
    /**
     * 获取故事列表
     * @param userId 用户ID，用来判断点赞收藏状态
     * @param callback
     * @returns {Promise}
     */
    getStoryList: function (form,callback) {
        let {userId,topicId,isSelf,storyId}  = form;
        var condition = [
            //lookup是连表查询
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
                    localField: '_id',
                    foreignField: 'storyId',
                    as: 'support'
                }
            },
            {
                $lookup:{
                    from: 'likes',
                    let:{sid:'$_id'},
                    pipeline:[
                        {
                            $match: {
                                $expr:{
                                    $and: [
                                        {$eq:['$status',1]},
                                        {$eq:['$storyId','$$sid']},
                                        {$eq:['$userId',mongoose.Types.ObjectId(userId)]}
                                        ]
                                }

                            }
                        }
                    ],
                    as: 'like'
                }
            },
            {
                $lookup:{
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'storyId',
                    as: 'comment'
                }
            },
            //拆分字符，将user数组变成对象
            { $unwind:"$user" },
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
                    likeByUser:{
                        $size:'$like'
                    },
                    supportByUser:{
                        $filter:{
                            input:'$support',
                            as: 'sup',
                            cond: {
                                $and: [
                                    {$eq: [ '$$sup.userId', mongoose.Types.ObjectId(userId) ]},
                                    {$eq: [ '$$sup.status', 1 ]},
                                ]
                            }
                        }
                    },
                    userId:'$user',
                    storyName: '$storyName',
                    storyContent: '$storyContent',
                    createDate: '$createDate',
                    comment:1
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
                    'userId.username':1,
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
                    coms:1
                }
            }
        ];
        //判断是否是在话题中搜素
        if(topicId){
            var macth = {
                $match:{
                    topicId:mongoose.Types.ObjectId(topicId)
                }
            }
            condition.unshift(macth);
        }
        //判断是否为我的发表
        if(isSelf){
            var macth = {
                $match:{
                    userId:mongoose.Types.ObjectId(userId)
                }
            }
            condition.unshift(macth);
        }
        //判断是否为获取详情
        if(storyId){
            var macth = {
                $match:{
                    _id:mongoose.Types.ObjectId(storyId)
                }
            }
            condition.unshift(macth);
        }
        return this.aggregate(condition).exec(
            (err, docs) =>{
                if(err) throw err;
                callback(err,docs);
            }
        )
    },

    /**
     * 获取故事列表
     * @param userId 用户ID，用来判断点赞收藏状态
     * @param callback
     * @returns {Promise}
     */
    getStoryListAdmin: function (form,callback) {
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
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup:{
                    from: 'supports',
                    localField: '_id',
                    foreignField: 'storyId',
                    as: 'support'
                }
            },
            {
                $lookup:{
                    from: 'likes',
                    let:{sid:'$_id'},
                    pipeline:[
                        {
                            $match: {
                                $expr:{
                                    $and: [
                                        {$eq:['$status',1]},
                                        {$eq:['$storyId','$$sid']},
                                    ]
                                }

                            }
                        }
                    ],
                    as: 'like'
                }
            },
            {
                $lookup:{
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'storyId',
                    as: 'comment'
                }
            },
            //拆分字符，将user数组变成对象
            { $unwind:"$user" },
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
                    likes:{
                        $size:'$like'
                    },
                    userId:'$user',
                    storyName: '$storyName',
                    storyContent: '$storyContent',
                    createDate: '$createDate',
                    comment:1,
                    status:1,
                    total:1
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
                    head:'$userId.head',
                    username:'$userId.username',
                    storyName: 1,
                    storyContent: 1,
                    createDate: 1,
                    bads:'$bad',
                    goods:'$good',
                    coms:1,
                    likes:1,
                    status:1,
                    key:'$_id'
                }
            }
        ];
        var wheres = {};
        if(form.storyName){
            wheres.storyName = {
                $regex:eval('/'+form.storyName+'/')
            }
        }
        if(form.storyStatus){
            wheres.status = Number(form.storyStatus)
        }
        if(form.storyName || form.storyStatus){
            condition.unshift({
                $match:wheres
            });
        }
        return this.aggregate(condition).exec(
            (err, docs) =>{
                if(err) throw err;
                this.countDocuments(wheres,(err,total)=>{
                    if(err) throw err;
                    callback(err,{list:docs,total: total});
                });
            }
        )
    },

    /**
     * 模糊查询故事列表
     * @param form
     * @param callback
     */
    getStoryListByText: function (form,callback) {
        return this.find({storyName:{$regex:form.keyword}},(err,docs)=>{
            if(err) throw err;
            callback(err,docs);
        });
    },

    getStotyTotal:function (callback) {
        return this.countDocuments({status:1},(err,docs)=>{
            if(err) throw err;
            callback(err,docs);
        });
    },

    getWeekData: function (callback) {
        var condition = [
            {
                $match:{
                    createDate:{
                        $gt: new Date(new Date(new Date().format('yyyy-MM-dd 23:59:59')).valueOf() - 24 * 60 * 60 * 1000 * 7),
                    }
                }
            },
            {
                $project : {
                    day : {$substr: [{"$add":["$createDate", 28800000]}, 5, 5] },//时区数据校准，8小时换算成毫秒数为8*60*60*1000=288000后分割成YYYY-MM-DD日期格式便于分组
                    createDate: 1
                }
            },
            {
                $group:{
                    _id:'$day',
                    count: { $sum: 1 },
                    date:{$last:'$createDate'}
                }
            },
            {
                $sort:{
                    date:1
                }
            },
            {
                $project:{
                    _id:1,
                    count:1
                }
            }
        ];
        return this.aggregate(condition).exec((err, docs) => {
            if (err) throw err;
            callback(err, docs);
        });
    },
    updateStoryStatus: function (obj,callback) {
        console.log(obj)
        return this.findOneAndUpdate({_id:obj._id},{status:obj.status},(err,docs)=>{
            if(err) throw err;
            callback(err,docs);
        });
    }
}

const Story = mongoose.model('Story', storySchema)

export default Story

