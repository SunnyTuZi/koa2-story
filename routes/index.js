'use strict';

import user from  './user/user'

export default app => {
    app.use(user.routes(), user.allowedMethods());
}

