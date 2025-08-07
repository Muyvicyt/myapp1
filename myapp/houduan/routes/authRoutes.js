const express = require('express');
const router = express.Router();


const { register, login } = require('../controllers/authController');
//定义了一个 POST 请求路由 /register，当客户端向这个路由发送 POST 请求时，
// 将调用 register 函数进行处理,然后将其保存到数据库中
router.post('/register', register);
router.post('/login', login);

module.exports = router;