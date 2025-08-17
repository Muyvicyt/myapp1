package com.example.myapp_hou.security;
//导入 JJWT（Java JWT）库 的核心类。
import io.jsonwebtoken.*;
//用于生成安全的签名密钥
import io.jsonwebtoken.security.Keys;
//从配置文件（如 application.yml）注入属性值
import org.springframework.beans.factory.annotation.Value;
//将此类注册为 Spring 容器中的 Bean，可被自动注入使用
import org.springframework.stereotype.Component;
//表示加密密钥的通用接口，JJWT 用它来做签名
import java.nio.charset.StandardCharsets;
import java.security.Key;
//用于设置 Token 的签发时间和过期时间
import java.util.Date;
/**
 * JWT 工具类：生成、解析、验证 Token
 * 这个类负责 JWT 的三大功能：
 * 生成 Token
 * 从 Token 提取用户名
 * 验证 Token 是否有效
 */
@Component  //标识为组件类,其他类（如 AuthService 或 JwtFilter）可以通过 @Autowired 注入它
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;  //密钥

    @Value("${jwt.expiration}") //注入配置24h
    private long expiration;//过期时间

    //获取签名密钥
    private Key getSigningKey() {
        // ✅ 正确方式：直接转字节数组
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        System.out.println("👉 当前 JWT Secret: '" + secret + "'");
        System.out.println("🔑 JWT Secret Length: " + keyBytes.length + " bytes");
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * 从用户名生成 Token（JWT）
     * 客户端向服务端证明身份：“我是谁”
     */
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())        //设置 Token 的生成时间
                .setExpiration(new Date(System.currentTimeMillis() + expiration))//设置 Token 的过期时间
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * 从 Token 中提取用户名
     */
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey()) //设置签名密钥
                .parseClaimsJws(token)//解析 Token
                .getBody()//获取负载
                .getSubject();//获取用户名
    }

    /**
     * 验证 Token 是否有效
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(getSigningKey())//设置签名密钥
                    .parseClaimsJws(token);//解析 Token
            return true;
        } catch (SecurityException | MalformedJwtException e)
        {
            //SecurityException签名密钥错误或签名验证失败
            //MalformedJwtException JWT格式错误
            System.err.println("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            //Token 已过期
            System.err.println("JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            //Token 使用了不支持的算法
            System.err.println("Unsupported JWT token: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            //Token 字符串为空或 null
            System.err.println("JWT claims string is empty: " + e.getMessage());
        }
        return false;
    }
}