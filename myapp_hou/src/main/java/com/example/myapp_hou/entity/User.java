package com.example.myapp_hou.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

@Data       //添加 getter 和 setter 方法

/**
 * 用户实体类，对应数据库表 users
 */
@Entity
@Table(name = "users")//将一个 Java 类映射到数据库中的某张表
public class User implements UserDetails {
    @Id//表示这个字段是数据库表的主键
    @GeneratedValue(strategy = GenerationType.IDENTITY)//表示主键值由数据库自动生成
    private Long id;

    @Column(unique = true, nullable = false)//字段名唯一，不能为空
    private String username;

    @Column(nullable = false)//不能为空
    private String password;

    private String avatar;      //头像存放的路径

    @Column(name = "created_at")
    private LocalDateTime createdAt;        //数据库中创建时间字段

    //构造函数
    public  User(){}
    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    //重写
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
