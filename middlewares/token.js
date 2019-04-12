/**
 * Create by Zwl on 2019/4/12
 * @Description: token验证中间件
 */

'use strict';

import jwt from 'jsonwebtoken'
import config from '../config/config'

/**
 * 创建token
 * @param id
 * @returns {*}
 */
const createToken = (id) =>{
    return  jwt.sign({
        id: id
    }, config.token.serect, { expiresIn: config.token.time});
}

/**
 * 解析token
 * @param token
 * @returns {*}
 */
const decodeToken = (token) =>{
    return jwt.decode(token, config.token.serect);

}
export {
    createToken,
    decodeToken
}
