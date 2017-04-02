var express  = require('express'); //加载express模块
var bodyParser = require('body-parser'); //用来格式表单数据 4.几版本后与express分离所以要单独引用 
var mongoose = require('mongoose'); //引入mongoose数据库模块 来连接数据库
var Movie = require('./models/movie'); //把模型加载进来
var _ = reuqire('underscore');
var port = process.env.PORT || 3000;  //设置端口 process.env.PORT  process是全局变量    可以使用 PORT=4000 node app.js 启动端口号
var path = require('path'); //静态资源寻找路径
var app = express();   //启动一个web服务器 实例附给app
mongoose.connect('mongodb://localhost/imooc'); //mongoose connect调用数据库 数据库名为imooc
app.set('views','./views/pages');  //设置视图默认目录
app.set('view engine','jade');  //设置 默认模板引擎 jdade
//app.use(express.bodyParser()); //后台有提交表单 这个是格式化表单
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'bower_components')));//静态资源从这里找
app.locals.moment = require('moment'); //list.jade 里面调用了moment格式化时间
app.listen(port);  //监听端口
console.log('imooc started on port'+port); //打印一条日志判断服务是否启动了

//index page 加入页面 路由
app.get('/',function(req,res){
	// var movies = [{
	// 		title:'机械战警',
	// 		_id:1,
	// 		poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
	// 	},{
	// 		title:'机械战警',
	// 		_id:2,
	// 		poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
	// 	},{
	// 		title:'机械战警',
	// 		_id:3,
	// 		poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
	// 	},{
	// 		title:'机械战警',
	// 		_id:4,
	// 		poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
	// 	},{
	// 		title:'机械战警',
	// 		_id:5,
	// 		poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
	// 	},{
	// 		title:'机械战警',
	// 		_id:6,
	// 		poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
	// 	}]
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('index',{
			title:'imooc 首页',
			movies:movies
		});
	});
});

//detail page 加入页面 路由
app.get('/movie/:id',function(req,res){
	// var movie = {
	// 	doctor:'何宽.贩子',
	// 	country:'美国',
	// 	title:'机械战警',
	// 	year:2014,
	// 	poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
	// 	language:'英语',
	// 	flash:'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
	// 	summary:'翻拍自1987年同名科幻经典，由《精英部队》导演'	
	// }
	var id = req.params.id;
	Movie.findById(id,function(err,movie){
		res.render('detail',{
			title:'imooc'+movie.title,
			movie: movie
		});
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
//admin update movie
app.get('/admin/update/:id',function(req,res){
	var id = req.params.id;
	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:'imooc 后台更新页'，
				movie:movie
			});
		});
	}
});
// admin post movie 从表单post过来的
app.post('/admin/movie/new',function(res,req){
	var id = req.body.movie._id; //用来判断是新增的还是修改
	var moveObj = req.body.movie;
	var _movie;
	if(id!=="undefined"){ //有id是修改
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err);
			}
			//以下引用了underscore的内容 所以需要引用 underscore
			_movie = _.extend(movie,movieObj);
			_movie.save(fnction(err,movie){
				if(err){
					console.log(err);
				}
				res.redirect('/movie/'+movie._id); //更新成功跳转到电影页面
			});
		})
	}else{//没有id是新增
		_movie = new Movie({
			doctor:movieObj.doctor,
			title:movieObj.title,
			country:movieObj.country,
			language:movieObj.language,
			year:movieObj.year,
			poster:movieObj.poster,
			summary:movieObj.summary,
			flash:movieObj.flash
		});
		_movie.save(function(err,movie){
			if(err){
				console.log(err)
			}
			res.redirect('/movie/'+movie._id); //更新成功跳转到电影页面
		})
	}
});

//list page 加入页面 路由
app.get('/admin/list',function(req,res){
	// var movies = [{
	// 		title: '机械战警',
	// 		_id: 1,
	// 		doctor: '何帕迪里亚',
	// 		country: '美国',
	// 		year: 2014,
	// 		language: '英语',
	// 		flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf'
	// 	}];

	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list',{
			title:'imooc 列表页',
			movies:movies
		});		
	});
});