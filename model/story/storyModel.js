/**
 * Create by Zwl on 2019/4/28
 * @Description:
 */

'use strict';


'use strict';

import  mongoose from 'mongoose'

const Schema = mongoose.Schema

const storySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    storyName: String,
    storyContent: String,
    themeId: String,
    createDate: { type: Date,default: Date.now }
});



storySchema.statics = {
    findUserInfo:function(callback){
        return this.find({},'_id storyName storyContent createDate').populate('userId','username head autograph sex').limit(10).exec(
            (err, result)=>{
                if(err) throw err;
                callback(result);
            }
        )
    }
}

const Story = mongoose.model('Story',storySchema)

export default Story

