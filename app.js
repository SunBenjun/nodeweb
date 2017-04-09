var express = require('express');//加载express模块
var path = require('path');//静态资源寻找路径

var mongoose = require('mongoose');//引入mongoose数据库模块 来连接数据库
var cookieParser = require('cookie-parser');
var session = require('express-session');
// var mongoStore = require('connect-mongo')(express);////因为session不在express里面了 
var mongoStore = require('connect-mongo')(session); //用来保存cookie的中间件  持久化session
var logger = require('morgan'); 
var bodyParser = require('body-parser');//用来格式表单数据 4.几版本后与express分离所以要单独引用 
var port = process.env.PORT || 3000;
var app = express();//启动一个web服务器 实例附给app
var dbUrl = "mongodb://localhost:27017/imooc";//连接的数据库
mongoose.Promise = require('promise'); //mongoose 默认用的是promise 加上它不报错误
// mongoose.Promise = require('bluebird');
mongoose.connect(dbUrl);//mongoose connect调用数据库 数据库名为imooc

app.set('views','./app/views/pages');//设置视图默认目录
app.set('view engine','jade');//设置 默认模板引擎 jdade
app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.cookieParser()); express新版 不支持了 需要单独引入 cookie 和 session
// app.use(express.session({ //依赖上面一个cookieParser中间件   ** express新不支持 session了
//     secret:'imooc'，
//     store: new mongoStore({
//         url:dbUrl,
//         collection:'sessions'
//     });
// }));
app.use(cookieParser());
app.use(session({
  secret:'imooc',
  resave: false,    
  saveUninitialized: false,
  store: new mongoStore({
      url:dbUrl,
      collection:'sessions'
  })
}));

app.use(express.static(path.join(__dirname,'public')));//静态资源从这里找
app.locals.moment = require('moment');//list.jade 里面调用了moment格式化时间
app.listen(port);//监听端口

if('development' === app.get('env')){ //拿到环境变量 如果是开发环境
  app.set('showStackError',true);//打印错误
  // app.use(express.logger(':method :url :status')); //'可以简单传入dev';
  app.use(logger(':method :url :status')); //'可以简单传入dev';
  app.locals.pretty = true; //页面格式化
  mongoose.set('debug',true);
}
//引入路由文件
require('./config/routes')(app);
console.log('Setver is running at ' + port);//打印一条日志判断服务是否启动了
