/**
 * Create by Zwl on 2019/6/18
 * @Description: 话题关注模型
 */

'use strict';

import  mongoose from 'mongoose'

const Schema = mongoose.Schema

/**
 * @param userId 用户ID
 * @param topicId 关注的用户ID
 * @param status 状态 1:关注/0:取消关注
 * @param createDate 创建时间
 */
const topicFollowSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    topicId:{
        type: Schema.Types.ObjectId,
        ref:'Topic'
    },
    status: { type: Number,default: 1},
    createDate: { type: Date,default: Date.now }
})
topicFollowSchema.statics = {
    followTopic:function (obj,callback) {
        return this.findOne({userId:obj.userId,topicId:obj.topicId},
            (err,docs) =>{
                if(docs){
                    docs.status = obj.status;
                    docs.save((err, docs) => {
                        callback(err,docs);
                    });
                }else{
                    this.create({userId:obj.userId,topicId:obj.topicId,status:obj.status},(err,docs)=>{
                        callback(err,docs);
                    });
                }
            });
    }

}
const TopicFollow = mongoose.model('topicFollow',topicFollowSchema)
export default TopicFollow
