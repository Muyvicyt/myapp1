package com.example.myapp_hou.service;

import com.example.myapp_hou.dto.RegisterRequest;
import com.example.myapp_hou.dto.UserResponse;

/**
 * 处理用户注册
 * 用户登录由Spring Security的认证流程处理
 */
public interface UserService {
    UserResponse register(RegisterRequest request);
    boolean existsByUsername(String username);
}
