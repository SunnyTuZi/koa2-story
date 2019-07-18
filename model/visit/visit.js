/**
 * Create by Zwl on 2019/7/10
 * @Description: 访问模型
 */

'use strict';

import  mongoose from 'mongoose'
import config from "../../config/config";

const Schema = mongoose.Schema

/**
 * @param userId 用户ID,
 * @param userName 用户姓名
 * @param ip ip地址
 * @param address ip地区
 * @param createDate 创建时间
 */
const visitSchema = new Schema({
    userId:String,
    userName:String,
    ip:String,
    address:String,
    v_type:Number,
    createDate: { type: Date,default: Date.now }
})
visitSchema.statics = {
    addRecord:function (form,callback) {
        this.findRecord(form,(docs)=>{
           if(docs.length == 0){
               return this.create(form,(err,docs)=>{
                  if(err) throw err;
                  callback(err,docs);
               });
           }
        });

    },
    findRecord:function (form,callback) {
        return this.find(
            {
                ip:form.ip,
                createDate:{
                    '$gt':new Date(new Date().valueOf() - config.groupInHour * 60 * 60 * 1000),
                }
            },(err,docs)=>{
               if(err) throw err;
               callback(docs);
            });
    },
    getVisitTotal:function (callback) {
        return this.countDocuments({},(err,docs)=>{
            if(err) throw err;
            callback(err,docs);
        });
    },
    getVisitCount:function (callback) {
        var condition = [
            {
                $match:{
                    createDate:{
                        $gt: new Date(new Date().valueOf() - 24 * 60 * 60 * 1000 * 7),
                    }
                }
            },
            {
                $group:{
                    _id:"$v_type",
                    visits:{
                        $push:'$createDate'
                    }
                }
            }
        ];
        return this.aggregate(condition).exec((err,docs)=>{
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
    }
}
const Visit = mongoose.model('visit',visitSchema)
export default Visit
