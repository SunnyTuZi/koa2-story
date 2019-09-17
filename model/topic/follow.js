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
    },
    /**
     * 获取一年内的故事发表
     * @param callback
     * @returns {Promise}
     */
    getYearData: function (callback) {
        var years = new Date().getFullYear()-1;
        var gtDate = new Date(new Date().setFullYear(years));
        var condition = [
            {
                $match:{
                    createDate:{
                        $gt: gtDate,
                    }
                }
            },
            {
                $project : {
                    day : {$substr: [{"$add":["$createDate", 28800000]}, 5, 2] },//时区数据校准，8小时换算成毫秒数为8*60*60*1000=288000后分割成YYYY-MM-DD日期格式便于分组
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
    }

}
const TopicFollow = mongoose.model('topicFollow',topicFollowSchema)
export default TopicFollow
