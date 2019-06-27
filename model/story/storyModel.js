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
     * 模糊查询故事列表
     * @param form
     * @param callback
     */
    getStoryListByText: function (form,callback) {
        console.log(form.keyword)
        return this.find({storyName:{$regex:form.keyword}},(err,docs)=>{
            if(err) throw err;
            callback(err,docs);
        });
    }
}

const Story = mongoose.model('Story', storySchema)

export default Story

