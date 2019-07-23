/**
 * Create by Zwl on 2019/4/9
 * @Description: 用户模型
 */

'use strict';

import  mongoose from 'mongoose'

const Schema = mongoose.Schema

/**
 * @param account 账号
 * @param sex 性别
 * @param age 年龄
 * @param username 昵称
 * param email 邮箱
 * @param psw 密码
 * @param autograph 签名
 * @param head 头像
 * @param status 状态 1:在线/0:拉黑
 * @param address 地区
 * @param createDate 创建时间
 */
const userSchema = new Schema({
    account: String,
    sex: Number,
    age: String,
    username: String,
    email: String,
    psw: String,
    address: String,
    autograph: String,
    dateOfBirth: String,
    head: String,
    status: { type: Number,default: 1},
    createDate: { type: Date,default: Date.now }
})
userSchema.statics = {
    getUserInfo: function (obj,callback) {
        return this.aggregate([
            {
                $match:{
                    _id:mongoose.Types.ObjectId(obj.userId)
                }
            },
            {
                $lookup:{
                    from: 'follows',
                    localField: '_id',
                    foreignField: 'followUserId',
                    as: 'bfo'
                }
            },
            {
                $lookup:{
                    from: 'follows',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'fo'
                }
            },
            {
                $project:{
                    isfo:{
                        $filter:{
                            input:'$bfo',
                            as: 'isfos',
                            cond:{
                                $and:[
                                    {$eq:['$$isfos.userId',mongoose.Types.ObjectId(obj.followUserId)]},
                                    {$eq:['$$isfos.status',1]}
                                    ]
                            }
                        }
                    },
                    bfos:{
                        $filter:{
                            input:'$bfo',
                            as: 'bfoss',
                            cond:{
                                $eq:['$$bfoss.status',1]
                            }
                        }
                    },
                    fos:{
                        $filter:{
                            input:'$fo',
                            as: 'foss',
                            cond:{
                                $eq:['$$foss.status',1]
                            }
                        }
                    },
                    username:1,
                    _id:1,
                    autograph:1,
                    head:1
                }
            },
            {
                $addFields:{
                    isfosize:{$size:'$isfo'},
                    fosize:{$size:'$fos'},
                    bfosize:{$size:'$bfos'}
                }
            }
        ]).exec((err,docs)=>{
            callback(err,docs);
        });
    },
    getUserTotal:function (callback) {
        return this.countDocuments({status:1},(err,docs)=>{
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
    getHotUser:function (callback) {
        var condtion = [
            {
                $lookup:{
                    from: 'follows',
                    localField: '_id',
                    foreignField: 'followUserId',
                    as: 'bfo'
                }
            },
            {
                $addFields:{
                    fans:{
                        $size:'$bfo'
                    }
                }
            },
            {
                $sort:{
                    fans:-1
                }
            },
            {$limit:5},
            {
                $project:{
                    key:'$_id',
                    username:1,
                    head:1,
                    fans:1
                }
            }
        ];
        return this.aggregate(condtion).exec((err,docs)=>{
            if(err) throw err;
            callback(err,docs);
        });
    }
}
const User = mongoose.model('User',userSchema)
export default User
