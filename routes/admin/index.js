/**
 * Create by Zwl on 2019/6/12
 * @Description: 聊天操作路由
 */

'use strict';

import Router from 'koa-router';
import Admin from '../../controller/admin/user';

const router = new Router({
    prefix:'/api/admin'
});

router.post('/login', Admin.login);
router.post('/checkToken', Admin.checkToken);
router.get('/getDataTotal', Admin.getDataTotal);


export default router
