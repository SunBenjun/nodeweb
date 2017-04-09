var Index = require('../app/controllers/index');//把模型加载进来
var User = require('../app/controllers/user');//把模型加载进来
var Movie = require('../app/controllers/movie');//把模型加载进来

module.exports = function(app){
    /*预先判断user是否登录过*/
    app.use(function(req,res,next){
      var _user = req.session.user;
      // if(_user){
        app.locals.user = _user; //把user 放到本地变量里面去
      // }
      return next();
    });
    //index page 加入页面 路由
    // app.get('/',function(req,res){
    //   Movie.fetch(function(err,movies) {
    //     if(err){
    //       console.log(err);
    //     }
    //     res.render('index',{
    //       title:'MOMO 首页',
    //       movies:movies
    //     });
    //   });
    // });
    app.get('/',Index.index);
    // signup
    // 表单是通过post方式提交的 保存用户名和密码
    // app.post("/user/signup",function(req,res){
    //     // user/signup/111?userId=1112  req.query.userId
    //     // user/signup/:userId          req.params.userId
    //     // req.query || req.body 根据提交方式 获取
    //     // req.params 就是不管什么 方式都可以通过它拿值 首先拿路 没有由 在拿 body 没有拿 传的参数
    //     var _user = req.body.user;
    //     //首先查找数据库是否已经有过用户名
    //     User.find({name:_user.name},function(err,user){
    //         if(err){
    //           console.log(err);
    //         }
    //         if(user){
    //             return res.redirect('/');
    //         }else{ //如果没有过那么保存用户名
    //             var user = new User(_user);
    //             user.save(function(err,user){
    //                 if(err){
    //                   console.log(err);
    //                 }
    //                 res.redirect('/admin/userlist');
    //             });            
    //         }
    //     });
    // });
    app.post('/user/signup',User.signup);
    //signin 登录
    // app.post("/user/signin",function(req,res){
    //   var _user = req.body.user;
    //   var name = _user.name;
    //   var password = _user.password;
    //   User.findOne({name:name},function(err,user){
    //     if(err){
    //       console.log(err);
    //     }
    //     if(!user){
    //       return res.redirect('/');
    //     }
    //     user.comparePassword(password,function(err,isMatch){
    //       if(err){
    //         console.log(err);
    //       }
    //       //密码正确
    //       if(isMatch){
    //         req.session.user = user; //登录成功保存到缓存 使用session前面要引用
    //         console.log('Password is matched');
    //         return res.redirect('/');
    //       }else{//密码错误 
    //         console.log('Password is not matched');
    //       }
    //     })
    //   })
    // });
    app.post("/user/signin",User.signin);
    //logout 退出登录
    // app.get("/logout",function(req,res){
    //   delete req.session.user; //删除session里面的user
    //   delete app.locals.user; //删除本地变量users
    //   res.redirect('/');
    // });
    app.get("/logout",User.logout);
    //用户列表路由
    // app.get('/admin/userlist',function(req,res){
    //   User.fetch(function(err,users) {
    //     if(err){
    //       console.log(err);
    //     }
    //     res.render('userlist',{
    //       title:'用户 列表页',
    //       users:users
    //     });
    //   });
    // });
    app.get('/admin/userlist',User.list);
    //detail page 加入页面 路由
    // app.get('/movie/:id',function(req,res){
    //   // var movie = {
    //   //  doctor:'何宽.贩子',
    //   //  country:'美国',
    //   //  title:'机械战警',
    //   //  year:2014,
    //   //  poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
    //   //  language:'英语',
    //   //  flash:'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
    //   //  summary:'翻拍自1987年同名科幻经典，由《精英部队》导演'  
    //   // }
    //   console.log('enter detail');
    //   var id = req.params.id;
    //   Movie.findById(id,function(err,movie) {
    //     if(err) {
    //       console.log(err);
    //     }
    //     res.render('detail',{
    //       title:'MOMO'+movie.title,
    //       movie:movie
    //     });
    //   });
    // });
    app.get('/movie/:id',Movie.detail);
    // app.get('/admin/update/:id',function(req,res) {
    //   var id = req.params.id;
    //   if(id){
    //     Movie.findById(id,function(err,movie) {
    //       res.render('admin',{
    //         title:"immoc 后台更新页",
    //         movie:movie
    //       });
    //     });
    //   }
    // });
    app.get('/admin/update/:id',Movie.update);
    // app.get('/admin/movie',function(req,res){
    //   console.log('enter admin');
    //   res.render('admin',{
    //       title:'MOMO 后台',
    //       movie:{
    //         doctor:'',
    //         country:'',
    //         title:'',
    //         year:'',
    //         poster:'',
    //         language:'',
    //         flash:'',
    //         summary:'',
    //       }
    //   });
    // });
    app.get('/admin/movie',Movie.new);
    //admin post movie
    // app.post('/admin/movie/new',function(req,res) {
    //   console.log('enter post');
    //   var id = req.body.movie._id;//用来判断是新增的还是修改
    //   var movieObj =req.body.movie;
    //   var _movie;
    //   if(id !== 'undefined'){
    //     Movie.findById(id,function(err,movie){
    //       if(err){
    //         console.log(err);
    //       }
    //       //以下引用了underscore的内容 所以需要引用 underscore
    //       //extend方法 用另一个对象里面的新的字段替换老的对象里面的对应的字段 
    //       _movie = _.extend(movie,movieObj)
    //       _movie.save(function(err,movie) {
    //         if(err){
    //           console.log(err);
    //         }
    //         res.redirect('/movie/'+movie._id);
    //       });
    //     });
    //   }
    //   else{
    //     _movie = new Movie({
    //       doctor:movieObj.doctor,
    //       title:movieObj.title,
    //       country:movieObj.country,
    //       language:movieObj.language,
    //       year:movieObj.year,
    //       poster:movieObj.poster,
    //       summary:movieObj.summary,
    //       flash:movieObj.flash
    //     });
    //     _movie.save(function(err,movie) {
    //       if(err){
    //         console.log(err);
    //       }
    //       res.redirect('/movie/'+movie._id);
    //     });
    //   }
    // });
    app.post('/admin/movie/new',Movie.new);
    // app.get('/admin/list',function(req,res){
    //   // var movies = [{
    //   //    title: '机械战警',
    //   //    _id: 1,
    //   //    doctor: '何帕迪里亚',
    //   //    country: '美国',
    //   //    year: 2014,
    //   //    language: '英语',
    //   //    flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf'
    //   //  }]; 
    //   Movie.fetch(function(err,movies) {
    //     if(err){
    //       console.log(err);
    //     }
    //     res.render('list',{
    //       title:'MOMO 列表页',
    //       movies:movies
    //     });
    //   });
    // });
    app.get('/admin/list',Movie.list);
    //list delete movie
    // app.delete('/admin/list',function(req,res) {
    //   var id = req.query.id;
    //   if(id) {
    //     Movie.remove({_id: id},function(err,movie) {
    //       if(err){
    //         console.log(err);
    //       }
    //       else{
    //         res.json({success: 1});
    //       }
    //     });
    //   }
    // });
    app.delete('/admin/list',Movie.del);
}
