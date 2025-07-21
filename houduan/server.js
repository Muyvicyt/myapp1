
//这是主文件入口
const express = require('express');
const cors = require('cors');               ///引入 cors 模块，用于处理跨域请求,允许前端访问后端 API。
const bodyParser = require('body-parser');     //引入 body-parser 模块，用于解析 HTTP 请求体中的数据
const pool = require('./config/db');
require('dotenv').config(); //加载 .env 文件中的环境变量到 process.env 中


const app = express();
const PORT = 3000;//服务器要监听的端口号


//启用 CORS 中间件
//验证配置是否生效
app.use((req, res, next) => {
    console.log('Request received:', req.method, req.url);
    next();
});
// CORS 中间件配置
const corsOptions = {
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

//启用 bodyParser 来解析请求体中的 JSON 数据
app.use(bodyParser.json());


// 测试数据库连接
pool.query('SELECT 1')
    .then(() => console.log('MySQL 数据库连接成功'))
    .catch(err => console.error('MySQL 连接失败:', err));

// 在所有路由前添加
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

/*
//在路由之前封装res.cc函数
app.use((req,res,next)=>{
    //status=1,失败
    //err是错误对象/错误的描述
    res.cc=function(err,status=1){
        res.send({
            status,
            message:err instanceof Error ?err.message:err
        })
    }
    next()
})


//保护路由
const authMiddleware = require('./middle/checkmiddle');
// 添加一个测试受保护路由--配置解析token 的中间件
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ 
        message: '这是一个受保护的路由',
        user: req.auth  ////可以把解析出来的用户信息挂载到req.auth属性上
    });
});
*/


//配置解析token的中间件
const secretkey = 'a3$fG7!zXqL2@vP9'
const { expressjwt: expressJwt } = require("express-jwt");
//所有 以 / api / 开头的路径，不需要 token，即：未登录也能访问
//所有 不以 /api/ 开头的路径，都必须携带有效的 token 才能访问（即：需要登录）。
// 替换原有的express-jwt配置
app.use(expressJwt({
    secret: secretkey,
    algorithms: ['HS256'],
    getToken: (req) => req.header('Authorization')?.replace('Bearer ', ''),
    requestProperty: 'auth' // 关键修改：将解码结果放到req.auth
}).unless({
    path: [/^\/api\//]
}));

// 使用路由--注册登录模块
const authRoutes = require('./routes/authRoutes');//引入自定义的路由模块 authRoutes--注册、登录接口的路由
app.use('/api/auth', authRoutes);     //将 authRoutes 路由挂载到 /api/auth 路径下

// 使用路由--视频播放模块
const videoRoutes = require('./routes/videoRoutes');
// 在已有路由配置后添加
app.use('/api/videos', videoRoutes);

//使用路由--获取用户信息，更新用户信息（用户名）更新密码
const userinfoRouters = require('./routes/userinfoRouters');
app.use('/my/corr', userinfoRouters);


//一定要把它放在所有路由的后面
// 开发环境直接托管前端目录
const path = require('path');
app.use(express.static(path.join(__dirname, '../study')));

//错误中间件   捕获JWT失败后产生的错误
app.use((err, req, res, next) => {
    //由于token解析出错
    if (err.name === 'UnauthorizedError')
        return res.send({status:401, message: '无效的token' });
    res.send({ status: 1, message: '服务器内部错误' });
})



app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});