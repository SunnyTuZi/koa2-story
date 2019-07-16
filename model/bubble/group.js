/**
 * Create by Zwl on 2019/5/17
 * @Description: 聊天分组
 */

'use strict';

import mongoose from 'mongoose';
import  config from '../../config/config';

const Schema = mongoose.Schema;

/**
 * @param userId 收藏用户Id
 * @param groupName 分组名字
 * @param status 收藏状态 1:收藏/0:未收藏
 * @param createDate 发表时间
 */

const BubbleGroupchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    groupName: String,
    staff: Number,
    status:{
        type: Number,
        default: 0
    },
    createDate: {type: Date, default: Date.now}
});

BubbleGroupchema.statics = {
    createGroup:function (form,callback) {
        return this.create(form,
            (err,docs) =>{
                callback(err,docs);
            }
        )
    },
    getList: function (callback) {
        return this.aggregate([
            {
                $match:{
                    createDate:{
                        '$gt': new Date(new Date().valueOf() - config.groupInHour * 60 * 60 * 1000)
                    }
                }
            },
            {
                $sort:{
                    createDate: 1
                }
            }
        ]).exec(
            (err,docs)=>{
                callback(err,docs)
            }
        )
    },
    getGroupTotal:function (callback) {
        return this.countDocuments({},(err,docs)=>{
            if(err) throw err;
            callback(err,docs);
        });
    },
    getWeekData: function (callback) {
        var condition = [
            {
                $match:{
                    createDate:{
                        $gt: new Date(new Date().valueOf() - 24 * 60 * 60 * 1000 * 7),
                    }
                }
            },
            {
                $project : {
                    day : {$substr: [{"$add":["$createDate", 28800000]}, 5, 5] },//时区数据校准，8小时换算成毫秒数为8*60*60*1000=288000后分割成YYYY-MM-DD日期格式便于分组
                }
            },
            {
                $group:{
                    _id:'$day',
                    count: { $sum: 1 }
                }
            }
        ];
        return this.aggregate(condition).exec((err,docs)=>{
            if(err) throw err;
            callback(err,docs);
        });
    }
}

const BubbleGroup = mongoose.model('BubbleGroup',BubbleGroupchema);

export default BubbleGroup;
