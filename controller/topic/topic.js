/**
 * Create by Zwl on 2019/6/14
 * @Description: 话题
 */

'use strict';

import TopicModel from '../../model/topic/topic';
import TopicFollow from '../../model/topic/follow';

class Topic {
    constructor() {
        this.addTopic.bind(this);
        this.getTopicList.bind(this);
        this.getTopicDeatil.bind(this);
        this.followTopic.bind(this);
    }
    async addTopic(ctx){
        let form = ctx.request.body;
        const promise = new Promise(async (resolve, reject) =>{
            await TopicModel.addTopic(form,(err,docs)=>{
                if(err){
                    ctx.body = {
                        code:0,
                        msg:'服务器异常，创建失败'
                    };
                    reject();
                }else{
                    ctx.body = {
                        code:1,
                        data:docs
                    }
                    resolve();
                }
            });
        });
        await promise;
    }

    async getTopicList(ctx){
        const promise = new Promise(async (resolve, reject) =>{
            await TopicModel.getTopicList((err,docs)=>{
                if(err){
                    ctx.body = {
                        code:0,
                        msg:'服务器异常，获取话题列表失败'
                    };
                    reject();
                }else{
                    ctx.body = {
                        code:1,
                        data:docs
                    }
                    resolve();
                }
            });
        });
        await promise;
    }

    async getTopicDeatil(ctx){
        let form = ctx.query;
        const promise = new Promise(async (resolve, reject) =>{
            await TopicModel.getTopicDeatil(form,(err,docs)=>{
                if(err){
                    ctx.body = {
                        code:0,
                        msg:'服务器异常，获取话题详情失败'
                    };
                    reject();
                }else{
                    ctx.body = {
                        code:1,
                        data:docs
                    }
                    resolve();
                }
            });
        });
        await promise;
    }

    async followTopic(ctx){
        let form = ctx.request.body;
        const promise = new Promise(async (resolve, reject) => {
            await TopicFollow.followTopic(form, (err, docs) => {
                if (err) {
                    ctx.body = {
                        code: 0,
                        msg: '服务器错误，关注失败~'
                    }
                    reject();
                } else {
                    ctx.body = {
                        code: 1
                    }
                    resolve();
                }
            });
        });
        await promise;
    }


}

export default new Topic();
