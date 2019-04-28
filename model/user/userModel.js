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
const User = mongoose.model('User',userSchema)
export default User
