package com.example.myapp_hou.repository;

import com.example.myapp_hou.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;//导入 Spring Data JPA 提供的通用数据访问接口

import java.util.Optional;
/**
 * 继承后，你自动获得以下方法（无需自己写）：
 * save(user)：保存或更新
 * findById(id)：根据 ID 查询
 * findAll()：查询所有
 * deleteById(id)：删除
 * existsById(id)：判断是否存在
 * 等等……
 */

/**
 * 用户数据访问接口
 */

/**
 * 参数一：表示这个 Repository 操作的是哪个实体类
 * 参数二：表示这个实体类的主键的数据类型
 */
public interface UserRepository extends JpaRepository<User, Long> {
    //自定义查询方法--Spring Data JPA 会自动实现这个方法，命名规则：findBy + 字段名（首字母大写
    Optional<User> findByUsername(String username);     //根据用户名查询用户
    //返回类型是 Optional<User>，表示：
    //找到了 → Optional.of(user)
    //没找到 → Optional.empty()
// Optional<User>自带的方法：
//    .isPresent();
//    . get();
  //  .isempty();
   // .orElse(null);

}
