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
// TODO:根据前端参数动态生成sql语句
const handleUpdateSql = (newData) => {
	let sql = "UPDATE users SET";
	let column = [];
	for (let key in newData) {
		if (newData[key] !== null && newData[key] !== undefined) {
			// 使用参数化查询以防止 SQL 注入
			if (typeof newData[key] === "string") {
				column.push(`${key} = '${newData[key]}'`);
			} else if (typeof newData[key] === "number") {
				column.push(`${key} = ${newData[key]}`);
			}
		}
	}
	// 添加空格以修复 SQL 语法错误
	return sql + " " + column.join(", ") + " WHERE id = " + newData.id;
};
// 修改用户信息
userRooter.post("/update", async (ctx, next) => {
	try {
		const requestBody = ctx.request.body;
		const querySql = `SELECT * FROM users WHERE id = ${requestBody.id}`;
		const result = await sqlFn(querySql, db);
		if (!requestBody.id) {
			ctx.body = {
				state: 405,
				msg: "参数错误，请核实后重新操作",
			};
			throw new Error("缺少用户名参数");
		}
		if (result.data.length > 0) {
			const sql = handleUpdateSql(requestBody);
			const res = await sqlFn(sql, db);
			ctx.body = {
				state: 200,
				msg: "修改用户信息成功",
				data: res,
			};
		} else {
			ctx.body = {
				state: 400,
				msg: "当前用户不存在",
			};
		}
	} catch (error) {
		console.error("修改用户信息时出错:", error);
		ctx.body = {
			state: 500,
			msg: "修改用户信息失败",
		};
	}
});

module.exports = userRooter;
