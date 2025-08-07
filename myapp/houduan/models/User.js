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


/**
   * 获取用户完整信息
   */
const getProfile= async (userId)=> {
    const [rows] = await pool.query(
        'SELECT id, username, created_at FROM users WHERE id = ?',
        [userId]
    );
    return rows[0];
}
/**
   * 更新用户信息
   */
const updateProfile=async (userId, updates)=> {
    // 1. 检查更新字段是否为空
    if (Object.keys(updates).length === 0) {
        throw new Error('没有提供有效更新字段');
    }
    // 2. 检查用户名是否已存在
    if (updates.username) {
        const [existing] = await pool.query(
            'SELECT id FROM users WHERE username = ? AND id != ?',
            [updates.username, userId]
        );
        if (existing.length > 0) {
            throw new Error('用户名已存在');
        }
    }
    // 3. 执行更新
    const [result] = await pool.query(
        'UPDATE users SET ? WHERE id = ?',
        [updates, userId]
    );
    return result.affectedRows > 0;
}

/**
 * 更新密码
 */
const updatePassword=async (userId, currentPassword, newPassword)=> {
    // 验证旧密码
    const [user] = await pool.query(
        'SELECT password FROM users WHERE id = ?',
        [userId]
    );
    if (!user[0]) throw new Error('用户不存在');
    const isMatch = await bcrypt.compare(currentPassword, user[0].password);
    if (!isMatch) throw new Error('用户密码错误');

    // 更新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await pool.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, userId]
    );

    return result.affectedRows > 0;
}


module.exports = {
    register,
    findByUsername,
    comparePassword,
    getProfile,
    updateProfile,
    updatePassword
};