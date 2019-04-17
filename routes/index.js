/**
 * Create by Zwl on 2019/4/9
 * @Description: 路由汇总
 */

'use strict';

import user from  './user/user'
import Router from "koa-router";
export default app => {
    app.use(user.routes(), user.allowedMethods());
}

