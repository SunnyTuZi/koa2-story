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
    }
}
const User = mongoose.model('User',userSchema)
export default User
