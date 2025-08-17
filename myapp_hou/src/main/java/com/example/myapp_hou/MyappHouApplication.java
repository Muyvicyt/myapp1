package com.example.myapp_hou;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.xml.crypto.Data;
import java.net.InetAddress;
import java.time.LocalDateTime;

/**
 * Spring Boot 启动类
 * 所有模块都会被自动扫描
 */
@SpringBootApplication
public class MyappHouApplication implements CommandLineRunner {
	@Autowired
	private JdbcTemplate jdbcTemplate;
	public static void main(String[] args) {
		SpringApplication.run(MyappHouApplication.class, args);
	}


	/**
	 * 检查服务器和数据库连接情况
	 * @param args：命令行参数
	 * @throws Exception：抛出异常
	 */
	@Override
	public void run(String... args) throws Exception {
		System.out.println("\n" +
				"===========================================\n" +
				"应用服务器启动成功\n" +
				"启动时间: " +LocalDateTime.now() + "\n");

		// 检查服务器信息
		try {
			String hostName = InetAddress.getLocalHost().getHostName();
			String hostAddress = InetAddress.getLocalHost().getHostAddress();
			System.out.println("🖥️ 服务器信息:\n" +
					" - 主机名: " + hostName + "\n" +
					" - IP地址: " + InetAddress.getByName("127.0.0.1"));
		} catch (Exception e) {
			System.err.println("无法获取服务器信息: "+ e.getMessage());
		}

		// 检查数据库连接
		try {
			long start = System.currentTimeMillis();//获取当前时间
			jdbcTemplate.queryForObject("SELECT 1", Integer.class);//让数据库返回数字 1
			long end = System.currentTimeMillis();
			System.out.println("💾 数据库连接成功\n" +
					"⏱️ 响应时间: " + (end - start) + "ms");
		} catch (Exception e) {
			System.err.println("数据库连接失败: " + e.getMessage());
		}

		System.out.println("===========================================\n");
	}
}
