import Router from 'koa-router'
import User from '../../controller/user/userController'
const router = new Router({
    prefix:'/user'
});

router.post('/register', User.register);
router.post('/login', User.login);
router.post('/uploadHead', User.uploadHead);

export default router
