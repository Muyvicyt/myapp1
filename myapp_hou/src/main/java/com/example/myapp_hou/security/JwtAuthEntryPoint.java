package com.example.myapp_hou.security;
//这是 Spring Security 抛出的认证异常基类。
import org.springframework.security.core.AuthenticationException;
//实现这个接口可以自定义返回的 HTTP 状态码和错误信息
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

//代表客户端的请求对象，可获取请求头、参数等
import jakarta.servlet.http.HttpServletRequest;
//代表服务器的响应对象，用于设置状态码、响应体等
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 当用户尝试访问受保护接口但未登录时，返回 401 错误
 */
@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request,    //请求对象
                         HttpServletResponse response,  //响应对象
                         AuthenticationException authException) throws IOException //抛出 IOException 异常
    {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);//设置 HTTP 状态码为 401
        response.setContentType("application/json");//告诉前端：我返回的是 JSON 数据，不是 HTML 或文本
        response.getWriter().write("{\"success\": false, \"message\": \"未登录或 Token 无效\"}");
    }
}