/**
 * Create by Zwl on 2019/4/28
 * @Description:
 */

'use strict';


'use strict';

import mongoose from 'mongoose'
import Support from '../story/supportModel'

const Schema = mongoose.Schema

const storySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    storyName: String,
    storyContent: String,
    goodsNum:{
      default: 0,
      type: Number
    },
    badsNum:{
        default: 0,
        type: Number
    },
    likeNum:{
        default: 0,
        type: Number
    },
    themeId: String,
    commentNum:{
        default: 0,
        type: Number
    },
    createDate: {type: Date, default: Date.now}
});

storySchema.statics = {
    getStoryList: function (callback) {
    //     return this.aggregate([
    //         {
    //             $lookup:{
    //                 from: 'users',
    //                 localField: 'userId',
    //                 foreignField: '_id',
    //                 as: 'user'
    //             }
    //         },
    //         {
    //             $lookup:{
    //                 from: 'supports',
    //                 localField: '_id',
    //                 foreignField: 'storyId',
    //                 as: 'support'
    //             }
    //         },
    //         {
    //             $count: '$support'
    //         }
    //         // {
    //         //     $group:{
    //         //         _id:{
    //         //             support:{
    //         //                 status:"$support.status",
    //         //                 count:{$sum:1}
    //         //             }
    //         //         }
    //         //
    //         //     }
    //         // }
    //     ]).exec(
    //         (err, docs) =>{
    //             callback(docs);
    //         }
    //     )
        return this.find().populate('userId').limit(10).exec(
                async (err, result) => {
                    if (err) throw err;
                    for(let i=0;i<result.length;i++){
                        var promise = new Promise(
                            async (resolve)=>{
                                await Support.count(result[i]._id,function (res) {
                                    for(let o of res){
                                        if(o._id.status == 2){
                                            result[i].badsNum = o.count;
                                        }else if(o._id.status == 1){
                                            result[i].goods = o.count;
                                        }
                                    }
                                    resolve();
                                });
                            }
                        );
                        await promise;
                    }
                    callback(result);

                }
            )

    },
    goodsAdd: function (storyId,goodsNum,badsNum,callback) {
        return this.find({_id:storyId},
            (err,docs) => {
                if(err) throw err;
                docs.goodsNum += goodsNum;
                docs.badsNum += badsNum;
                docs.save(
                    (err, result) =>{
                        if(err) throw err;
                        callback(result);
                    }
                )
            }
        )
    }
}

const Story = mongoose.model('Story', storySchema)

export default Story

