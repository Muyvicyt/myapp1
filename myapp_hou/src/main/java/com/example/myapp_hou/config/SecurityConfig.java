package com.example.myapp_hou.config;

//导入JWT相关的类
import com.example.myapp_hou.security.JwtAuthenticationFilter;
import com.example.myapp_hou.security.JwtAuthEntryPoint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
//用于获取 Spring Security 内置的 AuthenticationManager，用于验证用户名密码
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//用来配置哪些请求需要认证、使用什么认证方式等。
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
//UserDetailsService：加载用户信息的服务，是 Spring Security 自己提供的接口
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security 配置类
 * 流程：
 * HTTP 请求到达
 *       ↓
 * SecurityFilterChain 开始处理
 *       ↓
 * JwtAuthenticationFilter 拦截
 *       ↓ 有 Bearer Token?
 *       是 → 验证 JWT → 有效? → 是 → 设置 SecurityContext（已登录）
 *       ↓ 否 或 无效
 * 继续向下 → 可能到达 Login 接口 或 被拦截返回 401
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthEntryPoint unauthorizedHandler;

    @Autowired
    private UserDetailsService userDetailsService;//用户详情服务

    //注册 JWT 过滤器 Bean
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }
    //. 注册密码编码器
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    //注册 AuthenticationManager Bean
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 前后端分离，关闭 CSRF
                .csrf(csrf -> csrf.disable())
                //用户未登录（未认证）时，由哪个组件处理（JwtAuthEntryPoint）
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                //设置会话策略
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
               // 允许访问 /api/auth/** 的请求
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/api/auth/**").permitAll() // 登录注册放行
                        .anyRequest().authenticated() // 其他请求都需要登录
                );

        // 添加 JWT 过滤器，如果有 JWT 且有效 → 自动登录用户
        //在 UsernamePasswordAuthenticationFilter(Spring Security 框架自带的) 之前添加 JWT 过滤器
        //如果没有 JWT → 继续向下走（比如到登录接口）
        http.addFilterBefore(jwtAuthenticationFilter(),  UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}