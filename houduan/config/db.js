// 该 js 文件用于创建数据库连接池
const mysql = require('mysql2/promise');

// 创建数据库连接池
const pool = mysql.createPool({
    host: 'localhost', // 确保这是你的数据库地址
    user: 'root',      // 替换为你的 MySQL 用户名
    password: '123456',// 替换为你的 MySQL 密码
    database: 'myapp' , // 确保数据库名称正确
    connectionLimit: 15,          // 增加到15个连接
    connectTimeout: 10000,        // 获取连接超时10秒
    waitForConnections: true,     // 无可用连接时等待
    queueLimit: 100               // 等待队列长度
 
});

// 测试数据库连接
pool.getConnection()
    .then((connection) => {
        console.log('数据库连接成功');
        connection.release(); // 释放连接
    })
    .catch((err) => {
        console.error('数据库连接失败:', err);
    });

module.exports = pool; // 直接导出连接池对象