/**
 * Create by Zwl on 2019/4/28
 * @Description: 故事控制器
 */

'use strict';

import StoryModel from '../../model/story/storyModel';

class Story {
    constructor(){
        this.addStory.bind(this);
    }
    async addStory(ctx){
        let {userId, storyName, storyContent, themeId} = ctx.request.body;
        const newStory = {
            userId,
            storyName,
            storyContent,
            themeId
        }
        try {
            await StoryModel.create(newStory).then(
                (result) =>{
                    ctx.body = {
                        status: 1,
                        msg: '发表成功',
                        data: result
                    }
                }
            );
        }catch (e) {
            ctx.body = {
                status: 0,
                msg: '服务器错误，发表失败',
                data: e
            }
        }
    }

    async getList(ctx){
        const promise = new Promise(
            async (resolve,reject) =>{
                await StoryModel.findUserInfo(
                    (result) => {
                        ctx.body = {
                            status: '1',
                            data: result
                        }
                        resolve();
                    }
                )
            }
        )
        await promise;
    }
}

export default new Story();
