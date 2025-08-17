package com.example.myapp_hou.controller;

import com.example.myapp_hou.dto.LoginRequest;
import com.example.myapp_hou.dto.RegisterRequest;
import com.example.myapp_hou.dto.UserResponse;
import com.example.myapp_hou.security.JwtUtil;
import com.example.myapp_hou.service.UserService;
//==========Spring 框架的核心类==============
import org.springframework.beans.factory.annotation.Autowired;
//封装 HTTP 响应（状态码、头、体），用于精确控制返回结果
import org.springframework.http.ResponseEntity;
//注解，@RestController, @RequestMapping, @PostMapping, @RequestBody, @CrossOrigin 等注解都来自这里
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * 认证控制器：处理登录和注册
 */
@RestController     //标识为控制器，它相当于 @Controller + @ResponseBody
@RequestMapping("/api/auth")    //发送请求的 URL 路径为 /api/auth
//这个地址是和前端页面所在的地址一致（即浏览器地址栏的地址）
@CrossOrigin(origins = {"http://localhost:63342","http://localhost:8080", "http://localhost:3000"}) // 前后端分离需要跨域// *允许所有来源的请求访问
public class AuthController {
    @Autowired
    //使用 @Autowired 让 Spring 自动把 UserService 的实现类（UserServiceImpl）注入进来
    //你可以直接调用它的方法，比如 userService.register(request)
    private UserService userService;        //注入 UserService 类
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * 用户注册
     * controller 层负责接收前端 HTTP 请求，调用 service 处理业务，并返回响应数据。
     */
    //ResponseEntity<Map<String, Objects>:返回类型：响应数据
    //@RequestBody RegisterRequest request：表示请求体（JSON）会被自动反序列化为 RegisterRequest 对象
    @PostMapping("/register")       //发送 POST 请求的 URL 路径为 /api/auth/register
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request)
    {
        try {
            //调用 userService 的 register 方法注册
            UserResponse user = userService.register(request);
            //创建一个 Map 对象，用于返回给前端
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "注册成功");
            response.put("user", user);
            return ResponseEntity.ok(response);
        } catch (Exception e)
        {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * 用户登录（返回JWT Token）
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        try {
            // 认证用户凭据
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            // 设置认证信息到Security上下文
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 生成JWT Token
            String token = jwtUtil.generateToken(request.getUsername());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "登录成功");
            response.put("token", "Bearer " + token);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "用户名或密码错误");
            return ResponseEntity.status(401).body(error);
        }
    }

    /**
     * 获取当前用户信息（需要认证）
     * 获取用户信息阶段
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // 这里可以添加从数据库获取更多用户信息的逻辑
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("username", username);
        response.put("message", "当前用户信息");
        return ResponseEntity.ok(response);
    }
}
