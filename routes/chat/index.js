/**
 * Create by Zwl on 2019/6/12
 * @Description: 聊天操作路由
 */

'use strict';

import Router from 'koa-router';
import Chat from '../../controller/chat/record';

const router = new Router({
    prefix:'/api/chat'
});

router.post('/addRecord', Chat.addChatRecord);
router.post('/updateRecord', Chat.updateRecord);

export default router
