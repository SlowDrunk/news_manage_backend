// 引入路由
const Router = require("koa-router");
const router = new Router();
// 引入用户相关接口
const usersRouter = require("./user");
// 引入角色相关接口
const rolesRouter = require("./roles");
// router调用中间件
router.use("/users", usersRouter.routes(), usersRouter.allowedMethods());
router.use("/roles", rolesRouter.routes(), rolesRouter.allowedMethods());

module.exports = router;
