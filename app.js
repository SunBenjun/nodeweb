var express  = require('express'); //加载express模块
var bodyParser = require('body-parser'); //用来格式表单数据 4.几版本后与express分离所以要单独引用 
var port = process.env.PORT || 3000;  //设置端口 process.env.PORT  process是全局变量    可以使用 PORT=4000 node app.js 启动端口号
var path = require('path'); //静态资源寻找路径
var app = express();   //启动一个web服务器 实例附给app

app.set('views','./views/pages');  //设置视图默认目录
app.set('view engine','jade');  //设置 默认模板引擎 jdade
//app.use(express.bodyParser()); //后台有提交表单 这个是格式化表单
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'bower_components')));//静态资源从这里找
app.listen(port);  //监听端口
console.log('imooc started on port'+port); //打印一条日志判断服务是否启动了

//index page 加入页面 路由
app.get('/',function(req,res){
	res.render('index',{
		title:'imooc 首页',
		movies:[{
			title:'机械战警',
			_id:1,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
			title:'机械战警',
			_id:2,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
			title:'机械战警',
			_id:3,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
			title:'机械战警',
			_id:4,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
			title:'机械战警',
			_id:5,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
			title:'机械战警',
			_id:6,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		}]
	});
});

//detail page 加入页面 路由
app.get('/movie/:id',function(req,res){
	res.render('detail',{
		title:'imooc 详情页',
		movie:{
			doctor:'何宽.贩子',
			country:'美国',
			title:'机械战警',
			year:2014,
			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
			language:'英语',
			flash:'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
			summary:'翻拍自1987年同名科幻经典，由《精英部队》导演'
		}
	});
});

//admin page 加入页面 路由
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'imooc 后台录入页',
		movie:{
			title:'',
			doctor:'',
			country:'',
			year:'',
			poster:'',
			flash:'',
			summary:'',
			language:''
		}
	});
});

//list page 加入页面 路由
app.get('/admin/list',function(req,res){
	res.render('list',{
		title:'imooc 列表页',
		movies:[{
			title: '机械战警',
			_id: 1,
			doctor: '何帕迪里亚',
			country: '美国',
			year: 2014,
			language: '英语',
			flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf'
		}]
	});
});