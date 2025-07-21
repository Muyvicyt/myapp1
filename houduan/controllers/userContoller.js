const  User=require('../models/User');

//获取用户信息
exports.getinfo=async(req,res)=>{
    try{
        const user =await User.getProfile(req.auth.id);
        if(!user){
            return res.status(404).json({
                status:1,
                message:'用户不存在'
            });
        }
        res.status(200).json({
            status: 0,
            message: '获取用户信息成功'
        })
    }catch(err){
        res.status(500).json({
            status: 1,
            message: error.message
        });
    }
}

//更新用户信息
exports.updateinfo=async (req,res) => {
    try{
        // 1. 从请求体获取参数
        const { username } = req.body; // 可扩展其他字段如 email

        // 2. 参数验证
        if (!username) {
            return res.status(400).json({
                status: 1,
                message: '至少需要提供一个更新字段'
            });
        }
        // 3. 构建更新对象（防止SQL注入）
        const updates = {};
        if (username) updates.username = username;//赋值
        // 4. 调用模型方法
        const updated = await User.updateProfile(req.auth.id, updates);
        if(!updated)
        {
            return res.status(400).json({
                status: 1,
                message: '用户不存在或数据未变化'
            });      
        }
        // 5. 返回更新后的用户信息
        const updatedUser = await User.getProfile(req.auth.id);
        res.status(200).json({
            status: 1,
            message: '更新成功',
            data: updatedUser
        });
    } catch (error) {
        res.status(400).json({
            status: 1,
            message: error.message
        });
    }   
}

//修改密码
exports.updatePwd=async(req,res)=>{
    try{
        const {oldpwd,newpwd}=req.body;
        if(!oldpwd||!newpwd)
        {
            return res.status(400).json({
                status: 1,
                message: '密码不为空'
            });  
        }
        const updated=await User.updatePassword(
            req.auth.id,oldpwd,newpwd
        );
        if(!updated)
        {
            return res.status(400).json({
                status: 1,
                message: '密码更新失败'
            });
        }

        res.status(200).json({
            status: 0,
            message: '密码更新成功'
        }); 
    } catch (error) {
        const statusCode = error.message.includes('incorrect') ? 401 : 500;
        res.status(statusCode).json({
            status: 1,
            message: error.message
        });
    }
}