// houduan/routes/videoRoutes.js
const express = require('express');
const router = express.Router();
//导入视频控制模块
const videoController = require('../controllers/videoControllers')
const checkmiddle = require('../middle/checkmiddle');
//调用视频模块的方法
// 获取所有视频
router.get('/', videoController.getAllVideos);

// 获取单个视频信息
//:id 是一个 动态路由参数，表示这里可以传任意字符串或数字作为 id
router.get('/:id', videoController.getVideo);

// 流式传输视频
router.get('/stream/:id', videoController.streamVideo);

//上传视频
// 需要认证的路由
router.post('/upload', 
  checkmiddle, // 确保用户已登录
  videoController.uploadVideo
);

module.exports = router;