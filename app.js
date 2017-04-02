var express = require('express');//加载express模块
var path = require('path');//静态资源寻找路径
var _ = require('underscore');
var mongoose = require('mongoose');//引入mongoose数据库模块 来连接数据库
var Movie = require('./models/movie');//把模型加载进来
var bodyParser = require('body-parser');//用来格式表单数据 4.几版本后与express分离所以要单独引用 
var port = process.env.PORT || 3000;
var app = express();//启动一个web服务器 实例附给app
// mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/imooc');//mongoose connect调用数据库 数据库名为imooc

app.set('views','./views/pages');//设置视图默认目录
app.set('view engine','jade');//设置 默认模板引擎 jdade
app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));//静态资源从这里找
app.locals.moment = require('moment');//list.jade 里面调用了moment格式化时间
app.listen(port);//监听端口
console.log('Setver is running at ' + port);//打印一条日志判断服务是否启动了
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
  Movie.fetch(function(err,movies) {
    if(err){
      console.log(err);
    }
    res.render('index',{
      title:'MOMO 首页',
      movies:movies
    })
  })
})
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
  console.log('enter detail');
  var id = req.params.id;
  Movie.findById(id,function(err,movie) {
    if(err) {
      console.log(err);
    }
    res.render('detail',{
      title:'MOMO'+movie.title,
      movie:movie
    })
  })
})

app.get('/admin/update/:id',function(req,res) {
  var id = req.params.id;
  if(id){
    Movie.findById(id,function(err,movie) {
      res.render('admin',{
        title:"immoc 后台更新页",
        movie:movie
      })
    })
  }
})  

app.get('/admin/movie',function(req,res){
  console.log('enter admin');
  res.render('admin',{
      title:'MOMO 后台',
      movie:{
        doctor:'',
        country:'',
        title:'',
        year:'',
        poster:'',
        language:'',
        flash:'',
        summary:'',
      }
  })
})

//admin update
app.get('/admin/update/:id',function(req,res) {
  var id = req.params.id;
  if(id){
    Movie.findById(id,function(err,movie) {
      res.render('admin',{
        title:"immoc 后台更新页",
        movie:movie
      })
    })
  }
})

//admin post movie
app.post('/admin/movie/new',function(req,res) {
  console.log('enter post');
  var id = req.body.movie._id;//用来判断是新增的还是修改
  var movieObj =req.body.movie;
  var _movie;
  if(id !== 'undefined'){
    Movie.findById(id,function(err,movie){
      if(err){
        console.log(err);
      }
      //以下引用了underscore的内容 所以需要引用 underscore
      //extend方法 用另一个对象里面的新的字段替换老的对象里面的对应的字段 
      _movie = _.extend(movie,movieObj)
      _movie.save(function(err,movie) {
        if(err){
          console.log(err);
        }
        res.redirect('/movie/'+movie._id);
      })
    })
  }
  else{
    _movie = new Movie({
      doctor:movieObj.doctor,
      title:movieObj.title,
      country:movieObj.country,
      language:movieObj.language,
      year:movieObj.year,
      poster:movieObj.poster,
      summary:movieObj.summary,
      flash:movieObj.flash
    })
    _movie.save(function(err,movie) {
      if(err){
        console.log(err);
      }
      res.redirect('/movie/'+movie._id);
    })
  }
})

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
  Movie.fetch(function(err,movies) {
    if(err){
      console.log(err);
    }
    res.render('list',{
      title:'MOMO 列表页',
      movies:movies
    })
  })
})

//list
app.delete('/admin/list',function(req,res) {
  var id = req.query.id;
  if(id) {
    Movie.remove({_id: id},function(err,movie) {
      if(err){
        console.log(err);
      }
      else{
        res.json({success: 1});
      }
    })
  }
})