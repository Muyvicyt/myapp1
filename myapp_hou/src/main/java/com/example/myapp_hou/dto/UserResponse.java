package com.example.myapp_hou.dto;

import com.example.myapp_hou.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 响应 DTO（返回给前端的用户信息）
 * 目的：只把前端需要的信息返回，隐藏敏感字段（如密码）
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String avatar;
    private String createdAt;

    public static  UserResponse from(User user) //用于把 User 实体转换成 UserResponse DTO
    {
        UserResponse res=new UserResponse();//创建一个 UserResponse 对象
        //这个作用是：把 User 的 id、username、avatar、createdAt 属性赋给 UserResponse 对象
        res.setId(user.getId());
        res.setUsername(user.getUsername());
        res.setAvatar(user.getAvatar());
        res.setCreatedAt(user.getCreatedAt().toString());//LocalDateTime 转换成 String
        return res;
    }
}
