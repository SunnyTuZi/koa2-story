/**
 * Create by Zwl on 2019/7/3
 * @Description: 后台用户
 */

'use strict';

import AdminUserModel from "../../model/admin/user";
import UserModel from '../../model/user/userModel';
import StoryModel from '../../model/story/storyModel';
import TopicModel from '../../model/topic/topic';
import BubbleModel from '../../model/bubble/group';
import VisitModel from  '../../model/visit/visit';
import {createToken} from "../../middlewares/token";
import verifyToken from '../../middlewares/checkToken';
import crypto from "crypto";


class AdminUser {
    constructor() {
        this.encryption = this.encryption.bind(this);
        this.login = this.login.bind(this);
    }

    /**
     * 用户登录
     * @param ctx
     * @param next
     * @returns {Promise<void>}
     */
    async login(ctx, next) {
        let {account, psw, code} = ctx.request.body;
        if (account == '' || psw == '') {
            ctx.body = {
                code: 0,
                msg: '账号或密码不能为空',
            }
            return;
        }
        psw = this.encryption(psw);
        let cap = ctx.cookies.get('captcha');
        if (cap != code) {
            ctx.body = {
                code: 0,
                msg: '验证码不正确',
            }
            return;
        }
        const user = await AdminUserModel.findOne({account, psw});
        if (user) {
            await AdminUserModel.findOne({account}).then((result) => {
                let token = createToken({account: result.account, id: result._id});
                ctx.body = {
                    code: 1,
                    data: result,
                    token: token
                }
            })
        } else {
            ctx.body = {
                code: 0,
                msg:'账号或密码错误'
            }
        }

    }

    async getDataTotal(ctx){
        var data = {};
        const promiseStory = new Promise(async (resolve, reject) =>{
            await StoryModel.getStotyTotal((err,docs)=>{
               if(err) reject();
               data.storyTotal = docs;
               resolve();
            });
        });
        const promiseUser = new Promise(async (resolve, reject) =>{
            await UserModel.getUserTotal((err,docs)=>{
                if(err) reject();
                data.userTotal = docs;
                resolve();
            });
        });
        const promiseTopic = new Promise(async (resolve, reject) =>{
            await TopicModel.getTopicTotal((err,docs)=>{
                if(err) reject();
                data.topicTotal = docs;
                resolve();
            });
        });
        const promiseBuble = new Promise(async (resolve, reject) =>{
            await BubbleModel.getGroupTotal((err,docs)=>{
                if(err) reject();
                data.groupTotal = docs;
                resolve();
            });
        });
        await Promise.all([promiseStory, promiseUser,promiseTopic,promiseBuble]).then(() => {
           ctx.body = {
               code: 1,
               data: data
           }
        }).catch(() => {
            ctx.body = {
                code: 0,
                msg: '服务器异常，请稍后重试~'
            }
        });
    }

    async getLineData(ctx){
        var data = {};
        const visitPromise = new Promise(async (resolve, reject) => {
            await VisitModel.getWeekData((err,docs)=>{
               if(!err){
                   data.visit = docs;
                   resolve();
               }
            });
        });
        const userPromise = new Promise(async (resolve, reject) => {
            await UserModel.getWeekData((err,docs)=>{
                if(!err) {
                    data.user = docs;
                    resolve();
                }
            });
        });
        const groupPromise = new Promise(async (resolve, reject) => {
            await BubbleModel.getWeekData((err,docs)=>{
                if(!err){
                    data.group = docs;
                    resolve();
                }
            });
        });
        const storyPromise = new Promise(async (resolve, reject) => {
            await StoryModel.getWeekData((err,docs)=>{
                if(!err){
                    data.story = docs;
                    resolve();
                }
            });
        });
        await Promise.all([visitPromise, userPromise,groupPromise,storyPromise]).then(() => {
            var now_date = new Date();
            var now_timep = now_date.getTime();
            var dateArr = [];
            for (let i = 6; i >= 0 ; i --) {
                var _date = new Date(now_timep - i * 24 * 60 * 60 * 1000).format('MM-dd');
                dateArr.push(_date);
            }
            for(let key in data){
                let arr = data[key];
                let status = false;
                for(let x = 0;x < dateArr.length;x++){
                    let status = true;
                    for(let y = 0;y < arr.length;y++){
                        if(dateArr[x] == arr[y]._id){
                            status =  false;
                        }
                    }
                    if(status) arr.splice(x,0,{_id:dateArr[x],count:0});
                }

            }
            ctx.body = {
                code: 1,
                data: data
            }
        }).catch(() => {
            ctx.body = {
                code: 0,
                msg: '服务器异常，请稍后重试~'
            }
        });
    }

    async updateTopic(ctx){
        let form = ctx.request.body;
        const promise = new Promise(async (resolve, reject) => {
           await TopicModel.updateTopic(form,(err,docs)=>{
               if(err){
                   ctx.body = {
                       code: 0,
                       msg: '服务器错误，修改失败'
                   }
                   reject();
               }else{
                   ctx.body  ={
                       data:docs,
                       code:1
                   }
                   resolve();
               }
            })
        });
        await promise;
    }

    async getTopicRadar(ctx){
        const promise = new Promise(async (resolve, reject) => {
            await TopicModel.getTopicRadar((err,docs)=>{
               if(err){
                   ctx.body = {
                       code:0
                   }
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

    async getHotUser(ctx){
        const promise = new Promise( async (resolve, reject) => {
           await UserModel.getHotUser((err,docs)=>{
              if(err){
                  ctx.body = {
                      code: 0
                  }
                  reject();
              }else{
                  ctx.body = {
                      code: 1,
                      data:docs
                  }
                  resolve();
              }
           });
        });
        await promise;
    }

    async getHotTopic(ctx){
        const promise = new Promise( async (resolve, reject) => {
            await TopicModel.getHotTopic((err,docs)=>{
                if(err){
                    ctx.body = {
                        code: 0
                    }
                    reject();
                }else{
                    ctx.body = {
                        code: 1,
                        data:docs
                    }
                    resolve();
                }
            });
        });
        await promise;
    }

    async getStoryList(ctx){
        let form = ctx.query;
        const promise = new Promise( async (resolve, reject) => {
            await StoryModel.getStoryListAdmin(form,(err,docs)=>{
                if(err){
                    ctx.body = {
                        code: 0
                    }
                    reject();
                }else{
                    ctx.body = {
                        code: 1,
                        data:docs
                    }
                    resolve();
                }
            });
        });
        await promise;
    }

    async getTopicList(ctx){
        let form = ctx.query;
        const promise = new Promise( async (resolve, reject) => {
            await TopicModel.getTopicListAdmin(form,(err,docs)=>{
                if(err){
                    ctx.body = {
                        code: 0
                    }
                    reject();
                }else{
                    ctx.body = {
                        code: 1,
                        data:docs
                    }
                    resolve();
                }
            });
        });
        await promise;
    }

    async updateStory(ctx){
        let form = ctx.request.body;
        const promise = new Promise( async (resolve, reject) => {
            await StoryModel.updateStoryStatus(form,(err,docs)=>{
                if(err){
                    ctx.body = {
                        code: 0
                    }
                    reject();
                }else{
                    ctx.body = {
                        code: 1
                    }
                    resolve();
                }
            });
        });
        await promise;
    }

    async getUserList(ctx){
        const promise = new Promise( async (resolve, reject) => {
            await UserModel.getUserList((err,docs)=>{
                if(err){
                    ctx.body = {
                        code: 0
                    }
                    reject();
                }else{
                    ctx.body = {
                        code: 1,
                        data:docs
                    }
                    resolve();
                }
            });
        });
        await promise;
    }

    /**
     * token验证
     * @param ctx
     * @returns {Promise<void>}
     */
    async checkToken(ctx,next){
        verifyToken(ctx,next);
    }

    /**
     * 加密
     * @param password
     * @returns { 加密后字符串 }
     */
    encryption(password) {
        const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
        return newpassword
    }

    /**
     * 加密方式
     * @param password
     * @returns {string}
     */
    Md5(password) {
        const md5 = crypto.createHash('md5');
        return md5.update(password).digest('base64');
    }
}

export default new AdminUser();
