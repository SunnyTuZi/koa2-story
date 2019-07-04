/**
 * Create by Zwl on 2019/7/3
 * @Description: 后台管理员模型
 */

'use strict';

import  mongoose from 'mongoose'

const Schema = mongoose.Schema

/**
 * @param account 账号

 * @param username 昵称

 * @param psw 密码
 * @param head 头像
 * @param status 状态 1:在线/0:拉黑
 * @param roots 权限
 * @param createDate 创建时间
 */
const adminUserSchema = new Schema({
    account: String,
    username: String,
    psw: String,
    head: String,
    status: { type: Number,default: 1},
    roots:{
      type:Number,
      default:1
    },
    createDate: { type: Date,default: Date.now }
})
adminUserSchema.statics = {
    getUserInfo: function (obj,callback) {

    }
}
const AdminUser =  mongoose.model('AdminUser',adminUserSchema);
export default AdminUser;
