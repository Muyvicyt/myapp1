package com.example.myapp_hou.dto;

import lombok.Data;

/**
 * 接收登录请求数据
 */
@Data
public class LoginRequest {
    private String username;
    private String password;
}
