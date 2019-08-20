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
        return this.aggregate(condition).exec((err,docs)=>{
            if(err) throw err;
            callback(err,docs);
        });
    },
    getGroupList:function (form,callback) {
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
                    from:'users',
                    let:{uid:'$userId'},
                    pipeline:[
                        {
                            $match:{
                                $expr:{
                                    $and:[
                                        {$eq:['$_id','$$uid']},
                                    ]
                                }
                            }
                        }
                    ],
                    as:'atuor'
                }
            },
            {
                $project: {
                    groupName:1,
                    username:'$atuor.username',
                    head:'$atuor.head',
                    staff:1,
                    status:1,
                    createDate: 1,
                    key:'$_id'
                }
            }
        ];
        var wheres = {};
        if(form.groupNameKey){
            wheres.groupName = {
                $regex:eval('/'+form.groupNameKey+'/')
            }
        }
        if(form.status){
            wheres.status = Number(form.status);
        }
        if(form.groupNameKey || form.status){
            condition.unshift({
                $match:wheres
            });
        }
        return this.aggregate(condition).exec((err,docs)=>{
            if(err) throw err;
            this.countDocuments(wheres,(err,total)=>{
                if(err) throw err;
                callback(err,{list:docs,total: total});
            });
        });
    },
    updateGroupStatus:function (form,callback) {
        return this.findOneAndUpdate({_id:form._id},{status:0},(err,docs)=>{
            if(err) throw err;
            callback(err,docs);
        });
    }
}

const BubbleGroup = mongoose.model('BubbleGroup',BubbleGroupchema);

export default BubbleGroup;
