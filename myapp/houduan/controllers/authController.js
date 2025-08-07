//JWT 是一种常用于身份认证的加密令牌格式
const jwt = require('jsonwebtoken');      //引入 jsonwebtoken 模块，用于生成和验证 JWT（JSON Web Token）
const { register, findByUsername, comparePassword } = require('../models/User');


// 注册--接收用户名和密码 → 检查是否重复 → 存入数据库
exports.register = async (req, res) => {
    const { username, password } = req.body;     //req.body从前端获取过来的

    try {
        //检查是否存在相同用户名的用户
        const existingUser = await findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: '用户名已存在' });
        }
        //调用模型中的regi\myappster 方法创建新用户
        await register(username, password);
      //  console.log('注册成功' )
        res.status(201).json({ message: '注册成功' });
    } catch (error) {
        res.status(500).json({ message: '服务器错误--注册错误' });
    }
};

// 登录-接收用户名和密码 → 查找用户 → 校验密码 → 生成 JWT 返回给客户端
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await findByUsername(username);
        if (!user)      //用户不存在
             {
            return res.status(400).json({ message: '无效的用户名或密码' });
        }
        //使用 comparePassword函数比较用户输入的明文密码与数据库中存储的加密密码是否一致。
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '无效的用户名或密码' });
        }

        // 生成 token
        const token = jwt.sign({ id: user.id, username: user.username }/*，包含要编码到 token 中的信息*/,
             'a3$fG7!zXqL2@vP9',     //密钥
             {
            expiresIn: '1h'     //token 的过期时间
        });
      //  console.log('Generated Token:', token);
        res.status(200).json({
            message: '登录成功',
            token: token
        });
    } catch (error) {
        console.error('Error during login:', error)
        res.status(500).json({ message: '服务器错误--登录错误' });
    }
};