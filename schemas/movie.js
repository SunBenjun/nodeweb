var mongoose = require('mongoose');
var MovieSchema = new mongoose.Schema({
	doctor:String,
	title:String,
	language:String,
	country:String,
	summary:String,
	flash:String,
	poster:String,
	year:Number,
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}		
	}
});

MovieSchema.pre('save',function(next){   // pre('save 的意思是 每次存储数据之前都调用这个方法
	if(this.isNew){ //判断如果是新加的把创建时间和更新时间设置为当前时间
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();  //需要调用next 才会将存储流程走下去
});
//只有model实例化之后 才会具有这个方法 
MovieSchema.statics = {
	fetch:function(cb){
		return this
			.find({})
			.sort('meta.updateAt')   //按照更新时间排序 
			.exec(cb)  //执行回调方法 
	},
	findById:function(id,cb){ //查询单条数据
		return this
			.findOne({_id:id})
			.exec(cb)
	}
}

modue.exports = MovieSchema  //模式导出  模式创建完后要创建模型 model