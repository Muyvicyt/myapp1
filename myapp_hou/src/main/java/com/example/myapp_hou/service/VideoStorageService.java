package com.example.myapp_hou.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageService {
    @Value("${file.upload.path}")
    private String uploadPath;
        //MultipartFile  file：获取前端发过来的文件
    public String storeFile(MultipartFile  file,String userName) throws IOException {
        //创建文件目录
        Path uploadDir = Paths.get(uploadPath);
        //判断文件目录是否存在
        if (!uploadDir.toFile().exists()) {
            uploadDir.toFile().mkdirs();//如果不存在，则创建
        }

        //生成唯一文件名
        String orignalFileName = file.getOriginalFilename();//获取原始文件名
        String fileExtension = orignalFileName.substring(orignalFileName.lastIndexOf("."));//获取文件扩展名
        //生成文件名: 用户ID_当前时间戳_原始文件名
        String fileName = userName + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

        //保存文件
        //把文件名 fileName “拼接” 到上传目录 uploadDir 后面，生成一个完整的文件保存路径
        Path filePath = uploadDir.resolve(fileName);
        //参数一：文件输入流
        //参数二：文件保存路径
        // Files.copy：把上传的文件内容，从内存（输入流）拷贝并保存到您服务器硬盘上的指定路径(filePath)中
        Files.copy(file.getInputStream(), filePath);
        System.out.println("文件保存成功：" + filePath);
        //返回文件保存路径
        return "/avatars"+ fileName;
    }

    //删除文件
    public void deleteFile(String filePath) throws IOException {
        //filePath: 是前端返回的保存路径，包含文件名
        Path path = Paths.get(uploadPath).resolve(filePath.replace("/avatars", ""));
        if(Files.exists( path)){
            Files.delete(path);
        }
    }
}
