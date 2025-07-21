//JWT验证中间件，用于保护需要认证的路由
//配置解析token 的中间件
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        // 从请求头获取token
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: '未提供认证令牌' });
        }

        // 验证token
        const decoded = jwt.verify(token, 'a3$fG7!zXqL2@vP9');
        
        // 将解码后的用户信息附加到请求对象上
        req.auth = decoded;
        
        next();
    } catch (error) {
        console.error('Token验证失败:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: '令牌已过期' });
        }
        return res.status(401).json({ message: '无效的认证令牌' });
    }
};

module.exports = authMiddleware;