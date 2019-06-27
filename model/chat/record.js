/**
 * Create by Zwl on 2019/6/13
 * @Description: 聊天记录
 */

'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

/**
 * @param userId 发送信息用户Id
 * @param toUserId 接受信息用户Id
 * @param content 信息内容
 * @param status 信息状态 0:未读/1:已读/2:删除
 * @param createDate 发表时间
 */

const Chatchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    toUserId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: String,
    status:{
        default: 0,
        type: Number
    },
    createDate: {type: Date, default: Date.now}
});

Chatchema.statics = {
    addChatRecord:function (form,callback) {
        return this.create(form,(err,docs)=>{
            callback(err,docs);
        });
    },
    updateRecordStatus:function (form,callback) {
        return this.findOneAndUpdate({toUserId:form.toUserId,userId:form.userId,status:0},{status:1},(err,docs)=>{
            callback(err,docs);
        });
    },
    getUnReadMsgNum: function (form,callback) {
        return this.count({toUserId:form._id,status:0},(err,docs)=>{
            callback(err,docs);
        });
    },
    getUnReadMsgList:function (form,callback) {
        return this.aggregate([
            {
                $match:{
                    toUserId:mongoose.Types.ObjectId(form._id),
                    $or:[
                        {
                            status:{
                                $eq:0
                            }
                        },{
                            status:{
                                $eq:1
                            }
                        }
                    ]
                }
            },
            {
                $group : {
                    _id : "$userId",
                    lastcontent: {$last:'$content'},
                    lastdate: {$last:'$createDate'},
                    msgs:{$push:"$$ROOT"}
                }
            },
            {
                $lookup:{
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind:"$user" },
            {
                $project:{
                    'user.username':1,
                    'user.head':1,
                    'user._id':1,
                    lastcontent:1,
                    lastdate:1,
                    msgs:1,
                    unreads:{
                        $filter:{
                            input:'$msgs',
                            as: 'msg',
                            cond:{$eq:['$$msg.status', 0]}
                        }
                    }
                }
            },
            {
                $addFields:{
                    unread: {$size:'$unreads'}
                }
            },
            { $sort : {lastdate: -1} }

        ]).exec((err,docs)=>{
            callback(err,docs);
        });
    },
    getUnReadMsgByUser: function (form,callback) {
        return this.find({userId:form.userId,toUserId:form.toUserId,status:0}).populate('userId','username head')
            .exec((err,docs)=>{
            callback(err,docs);
        });
    },
    delMsgByUser: function (form,callback) {
        return this.updateMany({userId:form.userId,toUserId:form.toUserId},{$set:{status:2}},(err,docs)=>{
           if(err) throw err;
           callback(err,docs);
        });
    }
}

const SelfChat = mongoose.model('SelfChat',Chatchema);

export default SelfChat;
