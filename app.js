const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const session = require("koa-session");
const compress = require("koa-compress");

//引入路由
const index = require("./routes/index");
const users = require("./routes/users");
const login = require("./routes/login");
const register = require("./routes/register");
const shopmanger = require("./routes/shopmanger");
const api = require("./routes/api");
const account = require("./routes/account");
//引入自定义模块
const middleware = require("./controllor/middleware");

// error handler
onerror(app);

/**
 * middlewares配置
 *  */

app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"]
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

//自定义中间件判断登录权限
app.use(middleware.loginJudge);

//session配置
{
  app.keys = ["koa2 daha"];
  const CONFIG = {
    key: "koa:sess",
    maxAge: 86400000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: true,
    renew: false
  };

  app.use(session(CONFIG, app));
}
//静态资源配置
{
  app.use(
    views(__dirname + "/views", {
      extension: "ejs"
    })
  );
}
//开启gzip压缩
{
  const options = { threshold: 2048 };
  app.use(compress(options));
}

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(login.routes(), login.allowedMethods());
app.use(register.routes(), register.allowedMethods());
app.use(shopmanger.routes(), shopmanger.allowedMethods());
app.use(api.routes(), api.allowedMethods());
app.use(account.routes(), account.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
