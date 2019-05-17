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
 * @param themeId 分类ID
 * @param status 故事的状态 1:在线/0:违规/2:软删除
 * @param createDate 发表时间
 */

const storySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    storyName: String,
    storyContent: String,
    themeId: String,
    status:{
      default: 1,
      type: Number
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
     * @param uid 用户ID，用来判断点赞收藏状态
     * @param callback
     * @returns {Promise}
     */
    getStoryList: function (uid,callback) {
        return this.aggregate([
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
                    from: 'supports',
                    localField: '_id',
                    foreignField: 'storyId',
                    as: 'support'
                }
            },
            {
                $lookup:{
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'storyId',
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
                        $filter:{
                            input:'$like',
                            as: 'li',
                            cond:{$eq:['$$li.userId', mongoose.Types.ObjectId(uid)]}
                        }
                    },
                    supportByUser:{
                        $filter:{
                            input:'$support',
                            as: 'sup',
                            cond:{$eq:['$$sup.userId',mongoose.Types.ObjectId(uid)]}
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
                    'userId.uaername':1,
                    'userId.head':1,
                    'userId.autograph':1,
                    'userId.sex':1,
                    storyName: 1,
                    storyContent: 1,
                    createDate: 1,
                    bads:'$bad',
                    goods:'$good',
                    'supportByUser.status':1,
                    'likeByUser.status':1,
                    coms:1
                }
            }

        ]).exec(
            (err, docs) =>{
                if(err) throw err;
                //处理数据,将当前用户的点赞和收藏状态返回
                for(let item of docs){
                    if(item.supportByUser.length == 0){
                        item.supportByUser = 0;
                    }else{
                        item.supportByUser = item.supportByUser[0].status;
                    }
                    if(item.likeByUser.length == 0){
                        item.likeByUser = 0;
                    }else{
                        item.likeByUser = item.likeByUser[0].status;
                    }
                }
                callback(err,docs);
            }
        )
    }
}

const Story = mongoose.model('Story', storySchema)

export default Story

