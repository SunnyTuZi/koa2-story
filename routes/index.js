/**
 * Create by Zwl on 2019/4/9
 * @Description: 路由汇总
 */

'use strict';

import user from  './user/user';
import publicApi from  './public/index';
import story from  './story/story';
import bubble from './bubble/bubble';
import chat from './chat/index';
import topic from './topic/topic';
import admin from './admin/index';
import visit from './visit/visit';

export default app => {
    app.use(user.routes(), user.allowedMethods());
    app.use(publicApi.routes(), publicApi.allowedMethods());
    app.use(story.routes(), story.allowedMethods());
    app.use(bubble.routes(), bubble.allowedMethods());
    app.use(chat.routes(), chat.allowedMethods());
    app.use(topic.routes(), topic.allowedMethods());
    app.use(admin.routes(), admin.allowedMethods());
    app.use(visit.routes(), visit.allowedMethods());
}

