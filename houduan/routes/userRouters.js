const express = require('express');
const router = express.Router();
const {  getinfo, updateinfo, updatePwd } = require('../controllers/userContoller');
const authenticate = require('../middle/checkmiddle');

// 用户信息路由
router.get('/profile', authenticate, getinfo);
//需要提供用户名
router.put('/profile', authenticate, updateinfo);
//需要提供新旧密码
router.patch('/password', authenticate, updatePwd);

module.exports = router;