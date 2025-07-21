const db=require('../config/db')
const bcrypt=require('bcryptjs')
//获取用户信息的处理函数
exports.getuserinfo=async (req,res)=>{
    let connection;
    try{
        connection = await db.getConnection(); // 显式获取连接
        const timer = setTimeout(() => {
            res.status(504).json({ message: '数据库响应超时', timer: timer });
        }, 10000); // 3秒超时机制
        const sql = 'select id,username ,password from users where id =?'
        //身份认证成功之后，能把解析出来的用户信息挂载到req.auth属性上
       const [results]= db.query(sql, [req.auth.id]);
          
            if (results.length !== 1)
                return res.send({
                    status: 0,
                    message: '获取用户信息失败',
                    data: results[0]
                })

            res.send({
                status: 0,
                message: '获取用户信息成功',
                data: results[0]

            })
        
    }catch(err){
        res.status(401).json({ message: message.err });
    }

 

}

//更新用户信息的处理函数
exports.updateUserinfo=async (req,res)=>{
    try{
        const { id, username } = req.body;
        if (!id || id === '') {
            res.send({
                status: 0,
                message: '用户ID不能为空',
            })
        }

        // 构建要更新的字段
        const updateFields = {};
        if (username !== undefined) updateFields.username = username;
        // 如果没有任何字段需要更新
        if (Object.keys(updateFields).length === 0) {
            res.send({
                status: 0,
                message: '没有可更新的字段',

            })
        }
        const sql = 'update users set ? where id =?';
       const [results]= db.query(sql, [updateFields, id]);
        
            if (results.affectedRows !== 1)
                return res.send({
                    status: 0,
                    message: '更新用户失败'
                })
            res.send('更新成功');
        

    }catch(err)
    {
        res.status(401).json({ message: message.err });
    }
 
}

//修改密码
exports.updatePassword=async (req,res)=>{
    try{
        const sql = 'select * from users where id=?';
      const[results]=  db.query(sql, req.auth.id);
            if (results.length !== 1) return res.send({
                status: 0,
                message: '用户不存在',
            })
            //判断旧密码是否正确
            const compareRusult = bcrypt.compare(req.body.oldpwd, results[0].password)
            if (!compareRusult) return res.cc('旧密码错误！')

            //新密码
            const newsql = 'update users set password =? where id=?';
            //对新密码进行加密
            const newPwd = bcrypt.hash(req.body.newPwd, 10);
            db.query(newsql, [newPwd, req.auth.id], (err, results) => {
                if (err) return res.status(401).json({ message: message.err });
                if (results.affectedRows !== 1) return res.send({
                    status: 0,
                    message: '更新密码失败',
                })
                res.send({
                    status: 0,
                    message: '修改成功',
                })
            })
       
    }catch(err){
        res.status(401).json({ message: message.err });
    }
 
}