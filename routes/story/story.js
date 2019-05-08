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
router.post('/getList', Story.getList);
router.post('/support', Story.supportStory);
router.post('/like', Story.likeStory);
router.post('/commentAdd', Story.commentAdd);
router.post('/getComentList', Story.getComentList);
router.post('/getCommentTotalByStory',Story.getCommentTotalByStory);


export default router
