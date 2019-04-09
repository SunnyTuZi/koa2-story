import Router from 'koa-router'
import User from '../../controller/user/userController'
const router = new Router({
    prefix:'/user'
});

router.post('/register', User.register);
router.get('/', function (ctx, next) {
    ctx.body = 'this is a users response!'
})

export default router
