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

    /**
     * 发表故事
     * @param ctx
     * @returns {Promise<void>}
     */
    async addStory(ctx){
        let {userId, storyName, storyContent, topicId} = ctx.request.body;
        const newStory = {
            userId,
            storyName,
            storyContent,
            topicId
        };
        const  promise = new Promise( async (resolve, reject) => {
            await StoryModel.addStory(newStory,
                (err,docs) =>{
                    if(err){
                        ctx.body = {
                            code: 1,
                            msg: '服务器错误，发表失败~',
                            data: docs
                        }
                        reject();
                    }else{
                        ctx.body = {
                            code: 1,
                            msg: '发表成功~',
                            data: docs
                        }
                        resolve();
                    }
                }
            );
        });
        await promise;

    }

    /**
     * 获取故事列表
     * @param ctx
     * @returns {Promise<void>}
     */
    async getList(ctx,next){
        let form = ctx.query;
        const promise = new Promise(
            async (resolve,reject) =>{
                await StoryModel.getStoryList(form,
                    (err,result) => {
                        if (err) {
                            ctx.body = {
                                code: 0,
                                msg: '服务器错误，获取列表失败~',
                                data: result
                            }
                            reject();
                        } else {
                            ctx.body = {
                                code: 1,
                                data: result
                            }
                            resolve(next());
                        }
                    }
                )
            }
        )
        await promise;
    }

    /**
     * 根据storyId点赞或踩故事，并记录userId
     * @param ctx
     * @returns {Promise<void>}
     */
    async supportStory(ctx){
        let {storyId, userId, status}  = ctx.request.body;
        let updateDate = Date.now();
        const promise = new Promise(
            async (resolve,reject) =>{
                const supportForm = {
                    storyId,
                    userId,
                    status,
                    updateDate
                }
                await SupportModel.support(supportForm,
                    (err,docs) => {
                        if(err){
                            ctx.body = {
                                code: 0,
                                msg: '服务器错误，操作失败~'
                            }
                            reject();
                        }else{
                            ctx.body = {
                                code: 1,
                                data: docs
                            }
                            resolve();
                        }
                    }
                );
            }
        )
        await promise;
    }

    /**
     * 根据storyId收藏故事，并记录userId
     * @param ctx
     * @returns {Promise<void>}
     */
    async likeStory(ctx,next){
        let {storyId, userId, status}  = ctx.request.body;
        const promise = new Promise(
            async (resolve,reject) =>{
                const likeForm = {
                    storyId,
                    userId,
                    status
                }
                await LikeModel.likeSave(likeForm,(err,result) => {
                    if(err){
                        ctx.body = {
                            code: 0,
                            msg: '服务器错误，收藏失败~'
                        }
                        reject();
                    }else{
                        ctx.body = {
                            code: 1,
                            data: result
                        }
                        resolve(next());
                    }
                });
            }
        )
        await promise;
    }

    /**
     * 根据storyId添加评论，并记录userId
     * @param ctx
     * @returns {Promise<void>}
     */
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

    /**
     * 根据storyId获取评论，并根据页码和分页数筛选数据
     * @param ctx
     * @returns {Promise<void>}
     */
    async getComentList(ctx){
        let {storyId,page_no,page_size} = ctx.query;
        const conition = {
            storyId:storyId,
            page_no:Number(page_no)||1,
            page_size:Number(page_size)||1
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

    /**
     * 根据storyId获取评论数
     * @param ctx
     * @returns {Promise<void>}
     */
    async getCommentTotalByStory(ctx){
        let {storyId} = ctx.query;
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

    /**
     * 模糊查询故事列表
     * @param ctx
     * @returns {Promise<void>}
     */
    async getStoryListByText(ctx){
        let form = ctx.query;
        const promise = new Promise( async (resolve,reject) =>{
            await StoryModel.getStoryListByText(form,(err, docs)=>{
                if(err){
                    ctx.body = {
                        code: 0,
                        msg: '获取故事列表失败~'
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
}

export default new Story();
