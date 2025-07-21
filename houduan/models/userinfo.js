const pool =require('../config/db');
const bcrypt=require('bcryptjs');


class corr{

    ////获取用户信息的处理函数\
    static async getuserinfo (getdata){
        const {id ,usernmae}=getdata;
        const [rows] = await pool.query('select id,username  from users where id =?',[id,usernmae])
        return rows;
    }

    //更新用户信息的处理函数
    static async updateUserinfo(corrdata){
        const usernmae=corrdata;
        const [result] = await pool.query('update users set ? where id =?',[req.auth.id,usernmae]
        )
        return result.insertId;
    }

    static async 

}
