package com.example.myapp_hou.security;


import com.example.myapp_hou.entity.User;
import com.example.myapp_hou.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
/**
 * 流程：
 * 用户请求带 JWT → JwtAuthenticationFilter 拦截
 *        ↓
 * 解析出 username → 调用 UserDetailsService.loadUserByUsername(username)
 *        ↓
 * 从数据库查用户 → 返回 UserDetails（即 User 对象）
 *        ↓
 * Spring Security 设置 Authentication → 认证成功
 *        ↓
 * 允许访问受保护接口
 */
//UserDetailsService是Spring Security的核心接口，专门用于认证过程中加载用户详情：

/**
 * 自定义用户详情服务
 * 实现Spring Security的UserDetailsService接口
 * 用于从数据库加载用户信息
 */
@Service    //将此类注册为 Spring 的服务 Bean
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    //使用 构造函数注入 UserRepository
    //UserRepository能自动实现数据库查询
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 根据用户名从数据库中加载用户信息，并返回一个 UserDetails 对象
     * @param username 用户名
     * @return UserDetails 用户详情
     * @throws UsernameNotFoundException 用户未找到异常
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)     //调用 UserRepository 的方法查找用户
                .orElseThrow(() -> new UsernameNotFoundException("用户名不存在: " + username));

        return user; // 直接返回User实体，因为它已经实现了UserDetails接口
    }
}