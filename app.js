var express = require('express');//加载express模块
var path = require('path');//静态资源寻找路径
var _ = require('underscore');
var mongoose = require('mongoose');//引入mongoose数据库模块 来连接数据库
var cookieParser = require('cookie-parser');
var session = require('express-session');
// var mongoStore = require('connect-mongo')(express);////因为session不在express里面了 
var mongoStore = require('connect-mongo')(session); //用来保存cookie的中间件  持久化session
var Movie = require('./models/movie');//把模型加载进来
var User = require('./models/user');//把模型加载进来 引入 用户模型
var bodyParser = require('body-parser');//用来格式表单数据 4.几版本后与express分离所以要单独引用 
var port = process.env.PORT || 3000;
var app = express();//启动一个web服务器 实例附给app
var dbUrl = "mongodb://localhost:27017/imooc";//连接的数据库
mongoose.Promise = require('promise'); //mongoose 默认用的是promise 加上它不报错误
// mongoose.Promise = require('bluebird');
mongoose.connect(dbUrl);//mongoose connect调用数据库 数据库名为imooc

app.set('views','./views/pages');//设置视图默认目录
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
  console.log("user is session:");
  console.log(req.session.user); 
  Movie.fetch(function(err,movies) {
    if(err){
      console.log(err);
    }
    res.render('index',{
      title:'MOMO 首页',
      movies:movies
    });
  });
});
// signup
// 表单是通过post方式提交的 保存用户名和密码
app.post("/user/signup",function(req,res){
    // user/signup/111?userId=1112  req.query.userId
    // user/signup/:userId          req.params.userId
    // req.query || req.body 根据提交方式 获取
    // req.params 就是不管什么 方式都可以通过它拿值 首先拿路 没有由 在拿 body 没有拿 传的参数
    var _user = req.body.user;
    //首先查找数据库是否已经有过用户名
    User.find({name:_user.name},function(err,user){
        if(err){
          console.log(err);
        }
        if(user){
            return res.redirect('/');
        }else{ //如果没有过那么保存用户名
            var user = new User(_user);
            user.save(function(err,user){
                if(err){
                  console.log(err);
                }
                res.redirect('/admin/userlist');
            });            
        }
    });
});
//signin 登录
app.post("/user/signin",function(req,res){
  var _user = req.body.user;
  var name = _user.name;
  var password = _user.password;
  User.findOne({name:name},function(err,user){
    if(err){
      console.log(err);
    }
    if(!user){
      return res.redirect('/');
    }
    user.comparePassword(password,function(err,isMatch){
      if(err){
        console.log(err);
      }
      //密码正确
      if(isMatch){
        req.session.user = user; //登录成功保存到缓存 使用session前面要引用
        console.log('Password is matched');
        return res.redirect('/');
      }else{//密码错误 
        console.log('Password is not matched');
      }
    })
  })
});
//用户列表路由
app.get('/admin/userlist',function(req,res){
  User.fetch(function(err,users) {
    if(err){
      console.log(err);
    }
    res.render('userlist',{
      title:'用户 列表页',
      users:users
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
  console.log('enter detail');
  var id = req.params.id;
  Movie.findById(id,function(err,movie) {
    if(err) {
      console.log(err);
    }
    res.render('detail',{
      title:'MOMO'+movie.title,
      movie:movie
    });
  });
});

app.get('/admin/update/:id',function(req,res) {
  var id = req.params.id;
  if(id){
    Movie.findById(id,function(err,movie) {
      res.render('admin',{
        title:"immoc 后台更新页",
        movie:movie
      });
    });
  }
});

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
  });
});

//admin update
app.get('/admin/update/:id',function(req,res) {
  var id = req.params.id;
  if(id){
    Movie.findById(id,function(err,movie) {
      res.render('admin',{
        title:"immoc 后台更新页",
        movie:movie
      });
    });
  }
});

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
      });
    });
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
    });
    _movie.save(function(err,movie) {
      if(err){
        console.log(err);
      }
      res.redirect('/movie/'+movie._id);
    });
  }
});

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
    });
  });
});

//list delete movie
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
    });
  }
});