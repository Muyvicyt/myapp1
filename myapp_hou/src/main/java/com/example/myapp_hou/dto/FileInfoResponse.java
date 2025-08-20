package com.example.myapp_hou.dto;

import lombok.Data;

/**
 * 文件信息
 */
@Data
public class FileInfoDTO {
    private String filename;
    private String contentType;
    private long size;
    private boolean exists;
    public FileInfoDTO(String filename, String contentType, long size, boolean exists) {
        this.filename = filename;
        this.contentType = contentType;
        this.size = size;
        this.exists = exists;
    }
}
