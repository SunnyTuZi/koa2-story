/**
 * Create by Zwl on 2019/4/9
 * @Description: 用户操作路由
 */

'use strict';

import Router from 'koa-router';
import User from '../../controller/user/userController';

const router = new Router({
    prefix:'/api/user'
});

router.post('/register', User.register);
router.post('/login', User.login);
router.post('/uploadAvatar', User.uploadAvatar);
router.get('/getCode',User.getCode);
router.post('/edit',User.editInfo);
router.get('/getUserInfo',User.getUserInfo);
router.post('/follow',User.followUser);
router.get('/getFollowList',User.getFollowList);
router.get('/getByFollowList',User.getByFollowList);
router.get('/getLikeByUser',User.getLikeByUser);
router.get('/getCommentByUser',User.getCommentByUser);
router.get('/getMySupport',User.getMySupport);

export default router
