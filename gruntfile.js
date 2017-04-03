module.exports = function(grunt){
	grunt.initConfig({
		//三个任务 watch nodemon concurrent
		watch:{
			jade:{
				files:['views/**'],
				options:{
					livereload:true
				}
			},
			js:{
				files:['public/js/**','models/**/*.js','schemas/**/*.js'],
				// tasks:['jshinit'],
				options:{
					livereload:true
				}
			}
		},
		nodemon:{
			dev:{
				script: 'app.js',
				options:{
					// file:'app.js',
					args:[],
					ignoredFiles:['README.md','node_modules/**','.DS_Store'],
					watchedExtensions:['js'],
					watchedFolders:['app','config'],
					debug:true,
					delayTime:1,
					env:{
						PORT:3000
					},
					cwd:__dirname
				}
			}
		},
		concurrent:{
			tasks:['nodemon','watch'],
			options:{
				logConcurrentOutput:true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch'); //只要有文件添加修改删除就重新执行注册好的任务 
	grunt.loadNpmTasks('grunt-contrib-nodemon'); // 实时监听 app.js 即入口文件 有改动重启app.js
	grunt.loadNpmTasks('grunt-concurrent'); //慢任务开发的插件 如sass less 编译
	grunt.option('force',true); //加这个防止因为语法错误终断整个服务
	grunt.registerTask('default',['concurrent']);//注册默认任务 
}