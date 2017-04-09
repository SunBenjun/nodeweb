var User = require('../models/user');//把模型加载进来 引入 用户模型
// signup
// 表单是通过post方式提交的 保存用户名和密码
exports.signup = function(req,res){
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
};
    //signin 登录
exports.signin = function(req,res){
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
 };
    //logout 退出登录
exports.logout = function(req,res){
      delete req.session.user; //删除session里面的user
      // delete app.locals.user; //删除本地变量users
      res.redirect('/');
};
    //用户列表路由
exports.list = function(req,res){
      User.fetch(function(err,users) {
        if(err){
          console.log(err);
        }
        res.render('userlist',{
          title:'用户 列表页',
          users:users
        });
      });
};