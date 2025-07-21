//用于处理视频文件上传的中间件配置

const multer =require('multer');    //用于处理multipart/form-data类型的表单数据，主要用于上传文件
const path=require('path');
const fs=require('fs');
const crypto=require('crypto');

//创建上传目录
const uploadDir=path.join(__dirname,'../uploads/videos');//上传文件将被存储的目录
if(!fs.existsSync(uploadDir))//检查uploadDir是否存在
{
    fs.mkdirSync(uploadDir,{recursive:true});//如果不存在，则通过fs.mkdirSync方法创建该目录
}

//存储配置
const storage=multer.diskStorage            //指定了如何保存上传的文件
({
    //定义了上传文件的目标目录
    destination:(req,file,cb)=>{           // file:当前正在上传的文件的信息对象
        cb(null,uploadDir);                //回调函数cb用于指定存储路径
    },
    //定义了上传文件的命名规则
    filename:(req,file,cb)=>{
     const ext = path.extname(file.originalname).toLowerCase(); //获取文件扩展名
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;//随机生成文件名
    cb(null, filename);
  }
  
    
});

//文件过滤,用于控制哪些文件类型可以被上传
const fileFilter=(req,file,cb)=>{
    const allowTypes=['video/mp4', 'video/webm', 'video/ogg'];
    if(allowTypes.includes(file.mimetype)){
        cb(null,true);
    }else{
        //回调函数用于告诉 multer 当前上传的文件是否应该被接受或拒绝，并且可以在拒绝文件时提供错误信息
        cb(new Error('只允许上传MP4、WebM或Ogg格式的视频'),false);
    }
};

// 导出配置好的上传中间件
module.exports=multer({
    storage,
    fileFilter,
    limits:{
        fieldSize:1024*1024*500,//500MB限制
        files:1         //每次只允许上传一个文件
    }
})
