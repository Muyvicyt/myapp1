package com.example.myapp_hou.security;


import io.jsonwebtoken.ExpiredJwtException;
//Servlet API，用于操作请求、响应和过滤链。
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
//Spring Security 的认证令牌对象。
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//存放当前用户的认证信息
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.core.userdetails.UserDetails;
//获取用户信息
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * ===拦截每个请求，检查是否有 JWT Token，如果有就设置认证信息===
 * 流程：
 * HTTP 请求到达
 *       ↓
 * JwtAuthenticationFilter 拦截
 *       ↓
 * 检查 Header: Authorization: Bearer <token>
 *       ↓
 * 提取 token → 验证是否有效
 *       ↓ 是
 * 加载用户信息（UserDetailsService）
 *       ↓
 * 创建 Authentication 对象
 *       ↓
 * 放入 SecurityContext（相当于登录）
 *       ↓
 * 放行请求 → Controller 可以获取当前用户
 */
//继承 OncePerRequestFilter → 保证每个请求只经过一次此过滤器
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;    //用于验证 Token 和提取用户名

    @Autowired
    private UserDetailsService userDetailsService;//用于从数据库中查询用户信息

    @Override
    protected void doFilterInternal(HttpServletRequest request, //请求对象
                                    HttpServletResponse response,   //响应对象
                                    FilterChain chain) throws ServletException, IOException {
        //调用下面的方法
        String token = extractToken(request);       //获取请求中的 Token
        //如果有 Token 且 验证通过（签名正确、未过期）
        if (token != null && jwtUtil.validateToken(token)) {
            //获取用户名
            String username = jwtUtil.getUsernameFromToken(token);
            //获取用户信息
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            //创建认证对象--构造认证令牌
            //服务端内部表示“当前用户是谁”
          //  把 JWT 中的身份信息，转换成 Spring Security 能识别的“已登录状态”
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // 将认证信息放入 SecurityContext，表示“已登录”
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        //让请求继续往下走（进入下一个过滤器或到达 Controller）
        chain.doFilter(request, response);
    }

    /**
     * 从Authorization请求头中提取 JWT Token
     * 格式：Authorization: Bearer <token>
     */
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);// "Bearer " 是 7 个字符
        }
        return null;
    }
}