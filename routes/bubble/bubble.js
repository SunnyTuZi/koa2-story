/**
 * Create by Zwl on 2019/5/28
 * @Description: 广场模块
 */

'use strict';

import Router from 'koa-router'
import Bubble from '../../controller/bubble/chat';

const router = new Router({
    prefix:'/api/bubble'
});

router.post('/createGroup',Bubble.createChatGroup);
router.get('/getGroupList',Bubble.getGroupList);
router.post('/addChatRecord',Bubble.addChatRecord);

export default router
