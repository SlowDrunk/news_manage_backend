// 引入路由
const Router = require("koa-router");
// 引入数据库
const db = require("../utils/db");
// 处理数据库函数
const sqlFn = require("../utils/handleDB");
// 商品接口
const rolesRouter = new Router();
// 获取角色列表
rolesRouter.get("/", async (ctx, next) => {
	ctx.body = {
		state: 200,
		message: "获取成功",
		data: await sqlFn("SELECT * FROM roles", db),
	};
	next();
});
// 修改角色权限
rolesRouter.post("/updateRoles", async (ctx, next) => {
	try {
		const { rights, roleId } = ctx.request.body;
		// 执行更新操作
		const updateQuery = `UPDATE roles SET rights = '${JSON.stringify(
			rights
		)}' WHERE id = ${roleId}`;
		const updateResult = await sqlFn(updateQuery, db);
        ctx.body = {
            state: 200,
            message: "修改成功",
            data: updateResult.message,
        };
	} catch (error) {
		console.error("Error updating role:", error);
		ctx.body = {
			state: 500,
			message: "服务器错误",
			data: null,
		};
	}
	next();
});
// 删除角色


module.exports = rolesRouter;
