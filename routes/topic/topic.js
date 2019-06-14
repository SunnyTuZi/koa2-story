/**
 * Create by Zwl on 2019/6/14
 * @Description: 话题操作路由
 */

'use strict';

import Router from 'koa-router';
import Topic from '../../controller/topic/topic';

const router = new Router({
    prefix:'/api/topic'
});

router.post('/addTopic', Topic.addTopic);
router.get('/getTopicList', Topic.getTopicList);
router.get('/getTopicDeatil', Topic.getTopicDeatil);


export default router
