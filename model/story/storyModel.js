/**
 * Create by Zwl on 2019/4/28
 * @Description:
 */

'use strict';


'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const storySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    storyName: String,
    storyContent: String,
    goodsNum:{
      default: 0,
      type: Number
    },
    badsNum:{
        default: 0,
        type: Number
    },
    likeNum:{
        default: 0,
        type: Number
    },
    themeId: String,
    commentNum:{
        default: 0,
        type: Number
    },
    createDate: {type: Date, default: Date.now}
});

storySchema.statics = {
    getStoryList: function (uid,callback) {
        return this.aggregate([
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
            { $unwind:"$user" },
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
            {
                $addFields:{
                    bad:{ $size:'$bads.status'},
                    good:{ $size: '$goods.status'},
                    coms:{ $size:'$comment' }
                }
            },
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
                //处理数据
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
                callback(docs);
            }
        )
    }
}

const Story = mongoose.model('Story', storySchema)

export default Story

