package com.example.myapp_hou.dto;

import lombok.Data;

/**
 * 接收注册请求数据
 */
@Data
public class RegisterRequest {
    private String username;
    private String password;
}
