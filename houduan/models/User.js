const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// 注册用户
const register = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);// 加密密码
    const [result] = await pool.query(
        //SQL插入语句，将用户名和加密后的密码存入数据库的users表中
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword]  //将加密后的密码插入数据库
    );
    return result;
};
/*
 // 根据邮箱查找用户
const findByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];// 返回第一个匹配的用户
};
*/
// 根据用户名查找用户
const findByUsername = async (username) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
};

// 验证密码
const comparePassword = async (inputPassword, hash) => {
    return await bcrypt.compare(inputPassword, hash);       //hash是加密过的密码
};

module.exports = {
    register,
    findByUsername,
    comparePassword
};