/**
 * Create by Zwl on 2019/4/28
 * @Description: 故事控制器
 */

'use strict';

import StoryModel from '../../model/story/storyModel';
import SupportModel from '../../model/story/supportModel';
import LikeModel from '../../model/story/likeModel';
import CommentModel from '../../model/story/commentModel';

class Story {
    constructor(){
        this.addStory.bind(this);
        this.getList.bind(this);
        this.likeStory.bind(this);
        this.supportStory.bind(this);
        this.commentAdd.bind(this);
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
        let userId = ctx.request.body.userId;
        const promise = new Promise(
            async (resolve,reject) =>{
                await StoryModel.getStoryList(userId,
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

    async likeStory(ctx){
        let {storyId, userId, status}  = ctx.request.body;
        const promise = new Promise(
            async (resolve,reject) =>{
                const likeForm = {
                    storyId,
                    userId,
                    status
                }
                await LikeModel.likeSave(likeForm,(result) => {
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

    async commentAdd(ctx){
        let {storyId, userId, commentText}  = ctx.request.body;
        const commentForm = {
            storyId,
            userId,
            commentText
        }
        const promise = new Promise( async (resolve,reject) => {
            await CommentModel.commentAdd(commentForm,(err,result) =>{
                if(err){
                    ctx.body = {
                        code: 0,
                        msg: '服务器错误，提交评论失败~'
                    }
                    reject();
                }else{
                    ctx.body = {
                        code: 1,
                        data: result,
                        msg: '提交评论成功~'
                    }
                    resolve();
                }
            });
        });
        await promise;
    }

    async getComentList(ctx){
        let {storyId,page_no,page_size} = ctx.request.body;
        const conition = {
            storyId,
            page_no,
            page_size
        }
        const promise = new Promise( async (resolve,reject) =>{
            await CommentModel.getList(conition,(err, docs)=>{
                if(err){
                    ctx.body = {
                        code: 0,
                        msg: '获取评论列表失败~'
                    }
                    reject();
                }else{
                    ctx.body = {
                        code: 1,
                        data: docs
                    }
                    resolve();
                }
            });
        });
        await promise;
    }

    async getCommentTotalByStory(ctx){
        let {storyId} = ctx.request.body;
        const conition = {
            storyId
        }
        const promise = new Promise( async (resolve,reject) =>{
            await CommentModel.getTotal(conition,(err, docs)=>{
                if(err){
                    ctx.body = {
                        code: 0,
                        msg: '获取评论列表失败~'
                    }
                    reject();
                }else{
                    ctx.body = {
                        code: 1,
                        count: docs
                    }
                    resolve();
                }
            });
        });
        await promise;
    }
}

export default new Story();
