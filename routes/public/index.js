/**
 * Create by Zwl on 2019/4/23
 * @Description: 公共路由
 */

'use strict';

import Router from 'koa-router'
import City from '../../controller/public/city';

const router = new Router({
    prefix:'/api/public'
});

router.get('/getProvince',City.getProvince);
router.get('/getCity', City.getCity);


export default router
