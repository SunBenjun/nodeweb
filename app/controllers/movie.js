var Movie = require('../models/movie');//把模型加载进来
var _ = require('underscore');
    //detail page 加入页面 路由
exports.detail = function(req,res){
      // var movie = {
      //  doctor:'何宽.贩子',
      //  country:'美国',
      //  title:'机械战警',
      //  year:2014,
      //  poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
      //  language:'英语',
      //  flash:'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
      //  summary:'翻拍自1987年同名科幻经典，由《精英部队》导演'  
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
};

exports.update = function(req,res) {
      var id = req.params.id;
      if(id){
        Movie.findById(id,function(err,movie) {
          res.render('admin',{
            title:"immoc 后台更新页",
            movie:movie
          });
        });
      }
};

exports.new = function(req,res){
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
};



    //admin post movie
exports.save = function(req,res) {
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
};

exports.list = function(req,res){
      // var movies = [{
      //    title: '机械战警',
      //    _id: 1,
      //    doctor: '何帕迪里亚',
      //    country: '美国',
      //    year: 2014,
      //    language: '英语',
      //    flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf'
      //  }]; 
      Movie.fetch(function(err,movies) {
        if(err){
          console.log(err);
        }
        res.render('list',{
          title:'MOMO 列表页',
          movies:movies
        });
      });
};

    //list delete movie
exports.del = function(req,res) {
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
};