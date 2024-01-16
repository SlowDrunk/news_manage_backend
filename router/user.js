// 引入路由
const Router = require("koa-router");
// 引入数据库
const db = require("../utils/db");
// 处理数据库函数
const sqlFn = require("../utils/handleDB");
// 商品接口
const userRooter = new Router();
// 获取user列表
userRooter.get("/", async (ctx, next) => {
	ctx.body = {
		state: 200,
		message: "获取成功",
		data: await sqlFn("SELECT * FROM users", db),
	};
	next();
});
// 添加用户
const addUser = async (ctx, requestBody) => {
	try {
		const { username, password, roleState, defaultUser, region, roleId } =
			requestBody;
		const querySql = `SELECT * FROM users WHERE username = '${username}'`;
		const result = await sqlFn(querySql, db);
		if (result.data.length !== 0) {
			return { state: 400, message: "用户名已存在" };
		}
		if (username && password && roleId && defaultUser && roleState) {
			const sql = `INSERT INTO users (username, password, roleState, defaultUser, region, roleId, avatar) VALUES ('${username}',${password},${roleState},${defaultUser},'${region}',${roleId},'${
				requestBody.avatar ? requestBody.avatar : ""
			}')`;
			const insertResult = await sqlFn(sql, db);
			ctx.body = {
				state: 200,
				msg: "添加用户成功",
				data: insertResult,
			};
		} else {
			throw new Error("添加用户失败，用户已存在或缺少必要信息");
		}
	} catch (error) {
		console.error("添加用户时出错:", error);
		ctx.body = {
			state: 500,
			msg: "添加用户失败",
		};
	}
};
userRooter.post("/add", async (ctx, next) => {
	const requestBody = ctx.request.body;
	await addUser(ctx, requestBody);
});
// 删除用户
userRooter.post("/delete", async (ctx, next) => {
	try {
		const requestBody = ctx.request.body;
		const { id } = requestBody;
		const querySql = `SELECT * FROM users WHERE id = ${id}`;
		const result = await sqlFn(querySql, db);
		if (id) {
			if (result.data.length > 0) {
				const deleteSql = `DELETE FROM users WHERE id = ${id}`;
				const deleteResult = await sqlFn(deleteSql, db);

				ctx.body = {
					state: 200,
					msg: "删除用户成功",
					data: deleteResult,
				};
			} else {
				throw new Error("用户不存在");
			}
		} else {
			throw new Error("缺少用户名参数");
		}
	} catch (error) {
		console.error("删除用户时出错:", error);
		ctx.body = {
			state: 500,
			msg: "删除用户失败",
		};
	}
});

module.exports = userRooter;
