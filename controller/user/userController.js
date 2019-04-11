import UserModel from '../../model/user/userModel'
import crypto from 'crypto'
import {createToken, decodeToken} from "../../middlewares/token"
import fs from 'fs'
import path from 'path'
import mkdirs from '../../until/mkdir'

class User {
    constructor() {
        this.encryption = this.encryption.bind(this);
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.uploadHead = this.uploadHead.bind(this);
    }

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

    async login(ctx, next){
        let { account, psw } = ctx.request.body;
        psw = this.encryption(psw);
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

    async uploadHead(ctx,next){
         const file = ctx.request.files.file; // 获取上传文件
         const reader = fs.createReadStream(file.path);
         let filePath = path.join(process.cwd(), '/public/upload/head/');
         await mkdirs(filePath,async ()=>{
             ctx.body = {
                 status: 200,
                 msg: '上传成功'
             }
            // 创建可写流
            const upStream = fs.createWriteStream(filePath+`${file.name}`);
            // 可读流通过管道写入可写流
            reader.pipe(upStream);
            let id = ctx.request.body.id;
            let new_file_path = '/public/upload/head/'+ `${file.name}`
            await UserModel.findOneAndUpdate({_id: id},{head: new_file_path});
            ctx.body = {
                status: '200'
            }
         });

    }

    encryption(password) {
        const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
        return newpassword
    }

    Md5(password) {
        const md5 = crypto.createHash('md5');
        return md5.update(password).digest('base64');
    }
}

export default new User()
