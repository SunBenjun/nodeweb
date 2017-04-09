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
    // signup 注册
    app.post('/user/signup',User.signup);
    //signin 登录
    app.post("/user/signin",User.signin);
    app.get('/signin',User.showSignin);
    app.get('/signup',User.showSignup);
    //logout 退出登录
    app.get("/logout",User.logout);
    app.get('/admin/user/list',User.signinRequired,User.adminRequired,User.list);
    //detail page 加入页面 路由
    app.get('/movie/:id',User.signinRequired,User.adminRequired,Movie.detail);
    app.get('/admin/movie/update/:id',User.signinRequired,User.adminRequired,Movie.update);
    app.get('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.new);
    app.post('/admin/movie',User.signinRequired,User.adminRequired,Movie.save);
    app.get('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.list);
    //list delete movie
    app.delete('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.del);
}
