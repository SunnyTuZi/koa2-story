/**
 * Create by Zwl on 2019/5/7
 * @Description: 评论模型
 */

'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    storyId:{
        type: Schema.Types.ObjectId,
        ref: 'Story'
    },
    commentText: String,
    status:{
      type: Number,
      default: 1
    },
    createDate: {type: Date, default: Date.now}
});

commentSchema.statics = {
    commentAdd:function (form,callback) {
        return this.create(form,
            (err, docs) => {
                callback(err,docs);
            }
        )
    },
    getList:function (form,callback) {
        return this.find({storyId:form.storyId}).sort({createDate:-1}).limit(form.page_size)
            .skip((form.page_no-1)*form.page_size)
            .populate('userId','_id username head sex autograph')
            .exec(
                (err, docs) =>{
                    callback(err, docs);
                }
        );
    },
    getTotal:function (form,callback) {
        return this.countDocuments({storyId:form.storyId},
            (err,count) =>{
                callback(err,count);
            }
        );
    },
    getMyComment:function (form,callback) {
        return this.aggregate([
            {
                $lookup:{
                    from:'stories',
                    let:{sid:'$storyId'},
                    pipeline:[
                        {
                            $match: {
                                $expr:{
                                    $and:[
                                        {$eq:['$_id','$$sid']}
                                    ]
                                }
                            }
                        }
                    ],
                    as:'story'
                }
            },{
                $unwind:'$story'
            },
            {
                $lookup:{
                    from:'users',
                    localField:'userId',
                    foreignField:'_id',
                    as:'user'
                }
            },{
                $unwind:'$user'
            },
            {
                $match:{
                    $or:[
                        {
                            userId:{$eq:mongoose.Types.ObjectId(form.userId)}
                        },
                        {
                            'story.userId':{$eq:mongoose.Types.ObjectId(form.userId)}
                        }
                    ]
                }
            },
            {
                $project:{
                    commentText:1,
                    createDate:1,
                    'story.storyName':1,
                    'story._id':1,
                    'user._id':1,
                    'user.username':1
                }
            },{
                $sort:{createDate:-1}
            }
        ]).exec((err,docs)=>{
            if(err) throw err;
            callback(err,docs);
        });
    }
}

const Comment = mongoose.model('Comment',commentSchema);

export default Comment;
