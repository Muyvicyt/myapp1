package com.example.myapp_hou.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Value("${file.video-upload.path}")
    private String videoUploadPath;
    
    @Value("${file.upload.path}")
    private String avatarUploadPath;
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 映射视频文件（可选，提供另一种访问方式）
        registry.addResourceHandler("/videos/**")
                .addResourceLocations("file:" + videoUploadPath + "/");
        
        // 映射头像文件（可选）
        registry.addResourceHandler("/avatars/**")
                .addResourceLocations("file:" + avatarUploadPath + "/");
    }
}