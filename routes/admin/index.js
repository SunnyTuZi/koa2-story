/**
 * Create by Zwl on 2019/6/12
 * @Description: 聊天操作路由
 */

'use strict';

import Router from 'koa-router';
import Admin from '../../controller/admin/user';
import Upload from '../../controller/upload/upload';

const router = new Router({
    prefix:'/api/admin'
});

router.post('/login', Admin.login);
router.post('/checkToken', Admin.checkToken);
router.get('/getDataTotal', Admin.getDataTotal);
router.get('/getLineData',Admin.getLineData);
router.post('/upload',Upload.uploadFiles);
router.post('/updateTopic',Admin.updateTopic);

export default router
