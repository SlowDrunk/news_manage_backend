// 引入koa
const Koa = require("koa2");
// 声明Koa实例
const app = new Koa();
const port = 5050;
const bodyparser = require("koa-bodyparser");
// 引入数据库
const db = require("./utils/db");
// 引入路由实例
const router = require("./router");
// 使用body解析插件
app.use(bodyparser());
// 启动路由并允许任何请求方式
app.use(router.routes(), router.allowedMethods());

app.listen(port, () => {
	console.log("服务器启动成功，端口为", +port);
});
