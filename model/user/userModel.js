/**
 * Create by Zwl on 2019/4/9
 * @Description: 用户模型
 */

'use strict';

import  mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
    account: String,
    sex: Number,
    age: Number,
    username: String,
    psw: String,
    head: String,
    status: { type: Number,default: 1},
    createDate: { type: Date,default: Date.now }
})
const User = mongoose.model('User',userSchema)
export default User
