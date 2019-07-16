/**
 * Create by Zwl on 2019/7/10
 * @Description: 访问操作路由
 */

'use strict';

import Router from 'koa-router';
import Visit from '../../controller/visit/visit';

const router = new Router({
    prefix:'/api/visit'
});

router.post('/addRecord', Visit.addVisitRecord);
router.get('/getVisitCount', Visit.getVisitCount);
export default router
