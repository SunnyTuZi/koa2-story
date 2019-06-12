/**
 * Create by Zwl on 2019/6/11
 * @Description: 关注模型
 */

'use strict';

import  mongoose from 'mongoose'

const Schema = mongoose.Schema

/**
 * @param userId 用户ID
 * @param followUserId 关注的用户ID
 * @param status 状态 1:关注/0:取消关注
 * @param createDate 创建时间
 */
const followSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:'user'
    },
    followUserId:{
        type: Schema.Types.ObjectId,
        ref:'user'
    },
    status: { type: Number,default: 1},
    createDate: { type: Date,default: Date.now }
})
followSchema.statics = {
    followUser:function (obj,callback) {
        return this.findOne({userId:obj.userId,followUserId:obj.followUserId},
            (err,docs) =>{
                if(docs){
                    docs.status = obj.status;
                    docs.save((err, docs) => {
                        callback(err,docs);
                    });
                }else{
                    this.create({userId:obj.userId,followUserId:obj.followUserId,status:obj.status},(err,docs)=>{
                        callback(err,docs);
                    });
                }
            });
    }

}
const Follow = mongoose.model('follow',followSchema)
export default Follow
