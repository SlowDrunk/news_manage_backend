// 引入路由
const Router = require("koa-router");
const router = new Router();
// 引入商品
const usersRouter = require("./user");
// router调用中间件
router.use("/users", usersRouter.routes(), usersRouter.allowedMethods());

module.exports = router;
