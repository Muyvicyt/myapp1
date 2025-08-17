package com.example.myapp_hou.service.impl;

import com.example.myapp_hou.dto.RegisterRequest;//请求
import com.example.myapp_hou.dto.UserResponse;//响应
import com.example.myapp_hou.entity.User;
import com.example.myapp_hou.repository.UserRepository;
import com.example.myapp_hou.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * 用户服务实现类
 * 业务逻辑层（处理注册、登录、验证等）
 */

@Service//标识为服务类
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;//用来操作数据库（保存用户、查询用户名是否存在等
    @Autowired
    private PasswordEncoder passwordEncoder;//用来对密码进行加密

    @Override
    //参数是 RegisterRequest（前端传来的注册数据）。
    //返回 UserResponse（返回给前端的用户信息，不含密码）
    //假如前端传来的数据是：
    //request.setUsername("tom");        // Spring 自动调用
    //request.setPassword("123456");
    public UserResponse register(RegisterRequest  request)  //注册用户
    {
       if(existsByUsername(request.getUsername()))//调用自己封装的方法 existsByUsername
        {
            throw new RuntimeException("用户名已存在");
        }
       //加密 密码
        String encodedPassword = passwordEncoder.encode(request.getPassword());//对密码进行编码
      // 创建用户
        User user = new User(request.getUsername(), encodedPassword);//创建用户对象
      //用户才创建时间
      user.setCreatedAt(LocalDateTime.now());

        //调用 UserRepository 的 save 方法，把用户数据写入数据库
        User savedUser = userRepository.save(user);
       //返回响应 DTO
        return UserResponse.from(savedUser);//把 User 实体转换成 UserResponse DTO
    }
    @Override
    public  boolean existsByUsername(String username){
        //判断用户名是否存在,返回的是 Optional<User>
        return userRepository.findByUsername( username).isPresent();
    }

}
