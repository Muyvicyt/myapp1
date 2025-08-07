// houduan/controllers/videoController.js
//这个是视频播放控制器
const path = require('path');
const fs = require('fs');   // fs（文件系统）模块，用于读取本地视频文件
const Video = require('../models/video');    //引入视频播放模块，用于与数据库中的videos表进行交互
const upload = require('../middle/uploademiddleware');//引入之前配置好的multer上传中间件，用于处理文件上传。

exports.getAllVideos = async (req, res) => //获取所有视频
  {
  try {
    const videos = await Video.getAllVideos();    //调用 Video.getAllVideos() 方法，从数据库中获取所有视频数据
    res.json(videos);

  } 
  catch (error) 
  {
    res.status(500).json({ message: error.message }); //返回 HTTP 500 错误，并附带错误信息
  }
};

exports.getVideo = async (req, res) =>    //获取某个视频
  {
  try {
    const video = await Video.getVideoById(req.params.id);
    if (!video)   //找不到视频
       {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(video);    //找到了视频
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//播放视频
///从指定的本地路径读取视频文件，而视频文件本质上是由二进制数据组成的
exports.streamVideo = async (req, res) =>   //流式传输视频（边下边播)
   {
  try {
    const video = await Video.getVideoById(req.params.id);    //获取某个视频信息
    if (!video) 
      {
      return res.status(404).json({ message: 'Video not found' });
    }

    //拼接文件路径==后端通过拼接路径定位视频文件
    const videoPath = path.join(__dirname, '../uploads/videos', video.filename);       //video.filename 是数据库中存储的视频文件名
   // const videoPath = path.join(upload.uploadDir, video.filename);
    const stat = fs.statSync(videoPath);  //使用 fs.statSync() 获取视频文件的元信息
    const fileSize = stat.size;   //文件的大小
    const range = req.headers.range;    //请求视频时用来指定“请求哪一部分数据”的字段（比如拖动进度条时）

    if (range) {
      // 处理部分内容请求（用于流式传输）
      const parts = range.replace(/bytes=/, "").split("-");   //去掉 bytes= 前缀，然后以 - 分割，得到起始和结束字节
      const start = parseInt(parts[0], 10);   //解析起始和结束字节，
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;   //如果没有提供 end，则默认是文件结尾
      const chunksize = (end-start)+1;                //计算要读取的字节数（块大小）
      //使用 fs 模块读取文件并流式传输
      const file = fs.createReadStream(videoPath, {start, end});   //从 start 到 end 的可读流
      const head =
       {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,   //告诉浏览器这是哪一部分数据
        'Accept-Ranges': 'bytes',                               //说明服务器支持分段请求
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);                     //  发送 206 Partial Content 响应头
      file.pipe(res);                                //将视频流写入响应对象，发送给客户端
    } 
    else    //如果没有range请求，表示客户端请求的是整个视频
       {
      // 处理完整视频请求
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
    console.log('视频路径：', videoPath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//上传视频
exports.uploadVideo=[

     upload.single('video'),   //用于处理上传的文件并将结果附加到请求对象(req)上
                              //'video'是在HTML表单中用于文件上传的字段名（即<input type="file" name="video">）。
                              // multer会根据这个名称来识别并处理对应的文件上传。
  async(req,res)=>{
    try{
      if(!req.file){
        return res.cc('请上传视频文件',400)
      }
      const {title,description}=req.body;   //用来获取用户提交的表单数据
      const videoData={
        title:title||req.file.originalname,  //优先使用用户输入的标题，否则使用原始文件名
        description:description||'',
        filename: req.file.filename, // 如果允许用户自定义文件名，则这里使用用户输入的文件名
        thumbnail:'',
        filepath: `uploads/videos/${req.file.filename}` ,// 完整相对路径
        user_id: req.user?.id || null,      // // 从认证中间件设置的req.user中获取
        status: 1,
      };
      const videoId=await Video.addVideo(videoData);  //将这些数据保存到数据库中
      res.status(201).json({
        message: '视频上传成功',
        videoId,
        filename: videoData.filename // 返回实际使用的文件名 
      });

    }catch(err){
      if (req.file) {
        //	删除上传失败的临时文件
        fs.unlink(path.join(__dirname, '../uploads/videos', req.file.filename), () => {});
      }
      res.status(500).json({ message: err.message });
    }
    }
];