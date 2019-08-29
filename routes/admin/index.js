/**
 * Create by Zwl on 2019/6/12
 * @Description: 聊天操作路由
 */

'use strict';

import Router from 'koa-router';
import Admin from '../../controller/admin/user';
import Upload from '../../controller/upload/upload';
import User from "../../controller/user/userController";

const router = new Router({
    prefix:'/api/admin'
});

router.post('/login', Admin.login);
router.post('/checkToken', Admin.checkToken);
router.get('/getDataTotal', Admin.getDataTotal);
router.get('/getLineData',Admin.getLineData);
router.post('/upload',Upload.uploadFiles);
router.post('/updateTopic',Admin.updateTopic);
router.get('/getTopicData',Admin.getTopicRadar);
router.get('/getHotUser',Admin.getHotUser);
router.get('/getHotTopic',Admin.getHotTopic);
router.get('/getStoryList',Admin.getStoryList);
router.post('/updateStoryStatus',Admin.updateStory);
router.get('/getTopicList',Admin.getTopicList);
router.get('/getUserList',Admin.getUserList);
router.get('/getGroupList',Admin.getGroupList);
router.post('/updateGroupStatus',Admin.updateGroupStatus);
router.get('/getStoryBar',Admin.getStoryBar);
export default router
