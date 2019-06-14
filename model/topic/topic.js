/**
 * Create by Zwl on 2019/6/14
 * @Description: 话题模型
 */

'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * @param topicImg 话题图片
 * @param topicName 话题名称
 * @param topicInfo 话题简介
 * @param status 话题状态 1:显示/0:隐藏
 * @param createDate 发表时间
 */

const Topicchema = new Schema({
    topicImg:String,
    topicName:String,
    topicInfo:String,
    status:{
      default: 1,
      type: Number
    },
    createDate: {type: Date, default: Date.now}
});

Topicchema.statics = {
    addTopic:function (form,callback) {
        return this.create(form,(err,docs)=>{
           callback(err,docs);
        });
    },
    getTopicList:function (callback) {
        return this.find({status:1},(err,docs)=>{
           callback(err,docs);
        });
    },
    getTopicDeatil:function (id,callback) {
        return this.findOne({_id:id},(err,docs)=>{
           callback(err,docs);
        });
    }
}

const Topic = mongoose.model('Topic',Topicchema);

export default Topic;
