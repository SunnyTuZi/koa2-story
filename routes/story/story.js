/**
 * Create by Zwl on 2019/4/28
 * @Description: 用户操作故事
 */

'use strict';

import Router from 'koa-router'
import Story from '../../controller/story/storyController'

const router = new Router({
    prefix:'/api/story'
});

router.post('/add', Story.addStory);
router.get('/getList', Story.getList);
router.post('/support', Story.supportStory);


export default router
