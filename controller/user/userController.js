/**
 * Create by Zwl on 2019/4/9
 * @Description: 用户操作控制器
 */

'use strict';

import UserModel from '../../model/user/userModel'
import crypto from 'crypto'
import { createToken, decodeToken } from "../../middlewares/token"
import fs from 'fs'
import path from 'path'
import mkdirs from '../../until/mkdir'
import captchapng from 'captchapng'

class User {
    constructor() {
        this.encryption = this.encryption.bind(this);
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.uploadHead = this.uploadHead.bind(this);
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
                    status: 500,
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
                    status: 200,
                    message: '注册管理员成功',
                }

            }
        } catch (err) {
            ctx.body = {
                status: 500,
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
        let { account, psw } = ctx.request.body;
        psw = this.encryption(psw);
        let cap = ctx.cookies.get('captcha');
        console.log(cap)
        const user = await UserModel.findOne({ account, psw });
        if(user){
            await UserModel.findOne({account}).then((result) =>{
                let token = createToken(result.id);
                ctx.body = {
                    status: 200,
                    msg: '登陆成功',
                    data: result,
                    token: token
                }
            })

        }else{
            const is_account = await UserModel.findOne({account});
            if(!is_account){
                ctx.body = {
                    status: 500,
                    msg: '账号不存在'
                }
            }else{
                ctx.body = {
                    status: 500,
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
    async uploadHead(ctx,next){
         const file = ctx.request.files.file; // 获取上传文件
         const reader = fs.createReadStream(file.path);
         let filePath = path.join(process.cwd(), '/public/upload/head/');
         const promise = new Promise((resolve, reject) =>{
             mkdirs(filePath,async ()=>{
                 // 创建可写流
                 const upStream = fs.createWriteStream(filePath+`${file.name}`);
                 // 可读流通过管道写入可写流
                 reader.pipe(upStream);
                 let id = ctx.request.body.id;
                 let new_file_path = '/public/upload/head/'+ `${file.name}`
                 await UserModel.findOneAndUpdate({_id: id},{head: new_file_path},{multi: true},(err)=>{
                     if(err){
                         reject()
                     }else{
                         resolve(next());
                     }
                 })

             });
         });
         await promise.then(()=>{
             ctx.body = {
                 status: 200,
                 msg: '更新成功'
             }
         }).catch(()=>{
             ctx.body = {
                 status: 500,
                 msg: '更新失败'
             }
         })
    }

    async getCode(ctx){
        const cap = parseInt(Math.random() * 9000 + 1000);
        const p = new captchapng(80, 30, cap);
        p.color(0, 0, 0, 0);
        p.color(80, 80, 80, 255);
        const base64 = p.getBase64();
        ctx.cookies.set('captcha', cap, {maxAge: 360000, httpOnly: true});
        ctx.status = 200
        ctx.body = {
            code: 'data:image/png;base64,' + base64
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
