var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie'); //引入模式文件 拿到导出模块，可加后缀可不加
var Movie = mongoose.model('Movie',MovieSchema); //编译生成 Movie模型 “Movie" 模型名字
module.exports = Movie  //导出构造函数