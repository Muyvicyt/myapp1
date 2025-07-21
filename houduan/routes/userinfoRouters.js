//这个是获取用户信息的模块
const express=require('express')
const router=express.Router()
const checkmiddle = require('../middle/checkmiddle');
//导入路由处理模块
const userinfohandle=require('../controllers/userinfoController')
//获取用户基本信息的路由
router.get('/userinfo', checkmiddle ,userinfohandle.getuserinfo)
//更新用户信息的路由
router.post('/userinfo', checkmiddle ,userinfohandle.updateUserinfo)
//更新密码的路由
router.post('/updatepwd', checkmiddle ,userinfohandle.updatePassword)
module.exports=router