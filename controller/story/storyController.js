/**
 * Create by Zwl on 2019/4/28
 * @Description: 故事控制器
 */

'use strict';

import StoryModel from '../../model/story/storyModel';
import SupportModel from '../../model/story/supportModel';

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
                        code: 1,
                        msg: '发表成功',
                        data: result
                    }
                }
            );
        }catch (e) {
            ctx.body = {
                code: 0,
                msg: '服务器错误，发表失败',
                data: e
            }
        }
    }

    async getList(ctx){
        const promise = new Promise(
            async (resolve,reject) =>{
                await StoryModel.getStoryList(
                    (result) => {
                        ctx.body = {
                            code: 1,
                            data: result
                        }
                        resolve();
                    }
                )
            }
        )
        await promise;
    }

    async supportStory(ctx){
        let {storyId, userId, status}  = ctx.request.body;
        const promise = new Promise(
            async (resolve,reject) =>{
                const supportForm = {
                    storyId,
                    userId,
                    status
                }
                await SupportModel.support(supportForm,(result) => {
                    ctx.body = {
                        code: 1,
                        data: result
                    }
                    resolve();
                });
            }
        )
        await promise;
    }
}

export default new Story();
