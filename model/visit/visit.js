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
    }
}
const Visit = mongoose.model('visit',visitSchema)
export default Visit
