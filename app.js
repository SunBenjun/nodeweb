var express  = require('express'); //加载express模块
var port = process.env.PORT || 3000;  //设置端口 process.env.PORT  process是全局变量    可以使用 PORT=4000 node app.js 启动端口号
var app = express();   //启动一个web服务器 实例附给app

app.set('views','./views');  //设置视图根目录
app.set('view engine','jade');  //设置 默认模板引擎 jdade
app.listen(port);  //监听端口
console.log('imooc started on port'+port); //打印一条日志判断服务是否启动了

//index page 加入页面 路由
app.get('/',function(req,res){
	res.render('index',{
		title:'imooc 首页'
	});
});

//detail page 加入页面 路由
app.get('/movie/:id',function(req,res){
	res.render('detail',{
		title:'imooc 详情页'
	});
});

//admin page 加入页面 路由
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'imooc 后台录入页'
	});
});

//list page 加入页面 路由
app.get('/admin/list',function(req,res){
	res.render('list',{
		title:'imooc 列表页'
	});
});