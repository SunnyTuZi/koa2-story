/**
 * Create by Zwl on 2019/4/9
 * @Description: 用户操作路由
 */

'use strict';

import Router from 'koa-router'
import User from '../../controller/user/userController'
const router = new Router({
    prefix:'/api/user'
});

router.post('/register', User.register);
router.post('/login', User.login);
router.post('/uploadHead', User.uploadHead);
router.get('/getCode',User.getCode);

export default router
