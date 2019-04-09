import { UserModel } from "../../model/user/userModel";
import formidable from 'formidable'
import crypto from 'crypto'

class User {
    constructor() {
        this.encryption = this.encryption.bind(this);
    }

    async register(ctx,next) {
        const form = new formidable.IncomingForm();

        form.parse(ctx.req, async (err, fields, files) => {
            if (err) {
                ctx.body = {
                    status: 0,
                    type: 'FORM_DATA_ERROR',
                    msg: '表单信息错误'
                }
            }
            const {account, psw} = fields;
            console.log(account)
            try {
                const user = UserModel.findOne({account});
                if (user) {
                    ctx.body = {
                        status: 0,
                        type: 'USER_HAS_EXIST',
                        message: '该用户已经存在',
                    }
                } else {
                    const newPsw = this.encryption(psw);
                    const newUser = {
                        account: account,
                        psw: newPsw
                    }
                    await UserModel.create(newUser);
                    ctx.body = {
                        status: 1,
                        message: '注册管理员成功',
                    }
                }
            } catch (err) {

                ctx.body = {
                    status: 0,
                    type: 'REGISTER_ADMIN_FAILED',
                    message: '注册管理员失败',
                }
            }
        })
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
