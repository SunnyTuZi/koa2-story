/**
 * Create by Zwl on 2019/4/9
 * @Description: 用户操作控制器
 */

'use strict';

import UserModel from '../../model/user/userModel';
import FollowModel from '../../model/user/follow';
import LikeModel from '../../model/story/likeModel';
import CommentModel from '../../model/story/commentModel';
import crypto from 'crypto';
import { createToken, decodeToken } from "../../middlewares/token";
import fs from 'fs';
import path from 'path';
import mkdirs from '../../until/mkdir';
import captchapng from 'captchapng';

class User {
    constructor() {
        this.encryption = this.encryption.bind(this);
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.uploadAvatar = this.uploadAvatar.bind(this);
        this.getCommentByUser = this.getCommentByUser.bind(this);
    }

    /**
     * 用户注册
     * @param ctx
     * @param next
     * @returns {Promise<void>}
     */
    async register(ctx, next) {
        const { account, psw } = ctx.request.body;
        const newPsw = this.encryption(psw);
        try {
            const user = await UserModel.findOne({account});
            if (user) {
                ctx.body = {
                    code: 0,
                    type: 'USER_HAS_EXIST',
                    message: '该用户已经存在',
                }
            } else {
                const newUser = {
                    account: account,
                    psw: newPsw
                }
                await UserModel.create(newUser);
                ctx.body = {
                    code: 1,
                    message: '注册管理员成功',
                }

            }
        } catch (err) {
            ctx.body = {
                code: 0,
                type: 'REGISTER_ADMIN_FAILED',
                message: '注册管理员失败',
            }
        }
    }

    /**
     * 用户登录
     * @param ctx
     * @param next
     * @returns {Promise<void>}
     */
    async login(ctx, next){
        let { account, psw, code } = ctx.request.body;
        if(account == '' || psw ==  ''){
            ctx.body = {
                code: 0,
                msg: '账号或密码不能为空',
            }
            return;
        }
        psw = this.encryption(psw);
        let cap = ctx.cookies.get('captcha');
        if(cap != code){
            ctx.body = {
                code: 0,
                msg: '验证码不正确',
            }
            return;
        }
        const user = await UserModel.findOne({ account, psw });
        if(user){
            await UserModel.findOne({account}).then((result) =>{
                let token = createToken({account: result.account, id: result._id});
                ctx.body = {
                    code: 1,
                    data: result,
                    token: token
                }
            })

        }else{
            const is_account = await UserModel.findOne({account});
            if(!is_account){
                const newPsw = this.encryption(psw);
                const newUser = {
                    account: account,
                    psw: newPsw
                }
                await UserModel.create(newUser).then(
                    (result) =>{
                        let token = createToken({account: result.account, id: result._id});
                        ctx.body = {
                            code: 1,
                            msg: '登陆成功',
                            data: result,
                            token: token
                        }
                    }
                );
            }else{
                ctx.body = {
                    code: 0,
                    msg: '密码错误'
                }
            }
        }

    }

    /**
     * 头像上传
     * @param ctx
     * @param next
     * @returns {Promise<void>}
     */
    async uploadAvatar(ctx,next){
         const file = ctx.request.files.file; // 获取上传文件
         const reader = fs.createReadStream(file.path);
         let filePath = path.join(process.cwd(), '/public/images/head/');
         const promise = new Promise((resolve, reject) =>{
             mkdirs(filePath,async ()=>{
                 // 创建可写流
                 const upStream = fs.createWriteStream(filePath+`${file.name}`);
                 // 可读流通过管道写入可写流
                 reader.pipe(upStream);
                 let id = ctx.request.body.id;
                 let new_file_path = '/head/'+ `${file.name}`
                 await UserModel.findOneAndUpdate({_id: id},{head: new_file_path},{multi: true},(err)=>{
                     if(err){
                         ctx.body = {
                             code: 0,
                             msg: '更新失败'
                         };
                         reject();
                     }else{
                         ctx.body = {
                             code: 1,
                             msg: '更新成功',
                             url: new_file_path
                         }
                         resolve(next());
                     }
                 })

             });
         });
        await promise;
    }

    async editInfo(ctx){
        let {_id, username, sex, dateOfBirth, address, autograph, email}  = ctx.request.body;
        try{
              await UserModel.findOneAndUpdate({_id:_id},{username,sex,dateOfBirth,address,autograph,email},{new: true},(err,result)=>{
                  if(err){
                      ctx.body = {
                          code: 0,
                          msg: '更新失败'
                      }
                  }else{
                      ctx.body = {
                          code: 1,
                          msg: '更新成功',
                          data: result
                      }
                  }
              })
        }catch (err) {
            ctx.body = {
                code: 0,
                msg: '未知错误',
            }
        }
    }
    /**
     * 获取验证码
     * @param ctx
     * @returns {Promise<void>}
     */
    async getCode(ctx){
        const cap = parseInt(Math.random() * 9000 + 1000);
        const p = new captchapng(80, 30, cap);
        p.color(0, 0, 0, 0);
        p.color(80, 80, 80, 255);
        const base64 = p.getBase64();
        ctx.cookies.set('captcha', cap, {maxAge: 360000, httpOnly: true});
        ctx.status = 200
        ctx.body = {
            code: 1,
            codeImg: 'data:image/png;base64,' + base64
        }
    }

    /**
     * 获取用户信息
     * @param ctx
     * @returns {Promise<void>}
     */
    async getUserInfo(ctx){
        let {userId,followUserId} = ctx.query;
        const promise = new Promise( async (resolve, reject) => {
            await UserModel.getUserInfo({userId,followUserId}, (err, docs) => {
                if (err) {
                    ctx.body = {
                        code: 0,
                        msg: '服务器错误，获取用户数据失败~'
                    };
                    reject();
                } else {
                    ctx.body = {
                        code: 1,
                        data: docs[0]
                    };
                    resolve();
                }
            });
        });
        await promise;
    }

    /**
     * 关注用户
     * @param ctx
     * @returns {Promise<void>}
     */
    async followUser(ctx){
        let data  = ctx.request.body;
        const promise = new Promise( async (resolve, reject) => {
            await FollowModel.followUser(data,(err,docs)=>{
                if(err){
                    ctx.body = {
                        code:0,
                        msg:'服务器错误，关注失败~'
                    };
                    reject();
                }else {
                    let msg = docs.status == 1 ? '关注成功' : '取消关注成功';
                    ctx.body = {
                        code: 1,
                        msg:msg
                    };
                    resolve();
                }
            });
        });
        await promise;
    }

    /**
     * 获取关注用户列表
     * @param ctx
     * @returns {Promise<void>}
     */
    async getFollowList(ctx){
        var form = ctx.query;
        const promise = new Promise( async (resolve, reject) => {
            await FollowModel.getFollowList(form, (err, docs) => {
                if(err){
                    ctx.body={
                        msg:'服务器错误，获取失败~',
                        code:0
                    }
                    reject();
                }else{
                    ctx.body={
                        code:1,
                        data:docs
                    }
                    resolve();
                }
            });
        });
        await promise;
    }

    /**
     * 获取粉丝列表
     * @param ctx
     * @returns {Promise<void>}
     */
    async getByFollowList(ctx){
        var form = ctx.query;
        const promise = new Promise( async (resolve, reject) => {
            await FollowModel.getByFollowList(form, (err, docs) => {
                if(err){
                    ctx.body={
                        msg:'服务器错误，获取失败~',
                        code:0
                    }
                    reject();
                }else{
                    ctx.body={
                        code:1,
                        data:docs
                    }
                    resolve();
                }
            });
        });
        await promise;
    }

    /**
     * 获取我的收藏
     * @param ctx
     * @returns {Promise<void>}
     */
    async getLikeByUser(ctx){
        var form = ctx.query;
        const promise = new Promise( async (resolve, reject) => {
            await LikeModel.getLikeByUser(form, (err, docs) => {
                if(err){
                    ctx.body={
                        msg:'服务器错误，获取失败~',
                        code:0
                    }
                    reject();
                }else{
                    ctx.body={
                        code:1,
                        data:docs
                    }
                    resolve();
                }
            });
        });
        await promise;
    }

    /**
     * 获取我的评论
     * @param ctx
     * @returns {Promise<void>}
     */
    async getCommentByUser(ctx){
        var form = ctx.query;
        const promise = new Promise( async (resolve, reject) => {
            await CommentModel.getMyComment(form, (err, docs) => {
                if(err){
                    ctx.body={
                        msg:'服务器错误，获取失败~',
                        code:0
                    }
                    reject();
                }else{
                    ctx.body={
                        code:1,
                        data:docs
                    }
                    resolve();
                }
            });
        });
        await promise;

    }

    async checkToken(ctx){
        let { token } = ctx.body;
        const result = decodeToken(token);
        if(result){

        }
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

export default new User()
