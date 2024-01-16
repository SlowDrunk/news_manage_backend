// 引入路由
const Router = require("koa-router");
// 商品接口
const goodsRouter = new Router();

goodsRouter.get('/Digital',async (ctx, next) =>{
    ctx.body = '数码';
})

goodsRouter.get('/Clothes',async (ctx, next) =>{
    ctx.body = '服装';
})

module.exports = goodsRouter