/**
 * Create by Zwl on 2019/4/19
 * @Description: token验证
 */

'use strict';

import { decodeToken } from './token'

async function verifyToken(ctx, next) {
    const dataString = ctx.header.authorization;
    try {
        const dataArr = dataString.split(' ');
        const token = dataArr[1];
        let playload = await decodeToken(token);
        if (playload) {
            ctx.status = 200 //这里非常重要，只有设置了status，koa-router才识别请求正确继续进入路由
            ctx.body = {
                code: 1
            }
            await next()
        }
    } catch (error) {
        ctx.status = 401;
        ctx.body = {
            "msg": "token验证失败，请重新登陆",
            code: 0
        }
    }
}
export default verifyToken
