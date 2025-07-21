// houduan/models/Video.js
//这个是视频播放模块
const pool = require('../config/db');//导入数据库

//class是一个创建对象的模板或蓝图
//async关键字用来定义一个异步函数，而await用来等待一个异步函数完成，并得到其返回值。

class Video      //定义了一个名为Video的类，
{

  /**
   * 获取所有视频信息
   * @returns {Promise<Array>} 视频列表
   */
  static async getAllVideos()   //此方法用于获取所有视频信息
  {
    const [rows] = await pool.query('SELECT * FROM videos');    //执行SQL查询，从videos表中选择所有记录
    return rows;        //返回查询结果，即所有视频的信息
  }


   /**
   * 根据ID获取视频信息
   * @param {number} id 视频ID
   * @returns {Promise<Object|null>} 视频信息或null
   */
  static async getVideoById(id) //根据给定的id参数获取特定视频的信息
   {
    const [rows] = await pool.query('SELECT * FROM videos WHERE id = ?', [id]);
    return rows[0];
  }

  /**输入 addVideo({ ... }) 的时候，就会自动提示你 videoData 应该包含哪些字段
   * 添加新视频
   * @param {Object} videoData 视频数据
   * @param {string} videoData.title 视频标题
   * @param {string} videoData.description 视频描述
   * @param {string} videoData.filename 视频文件名
   * @param {string} videoData.thumbnail 缩略图路径
   * @returns {Promise<number>} 新视频ID
   */
  static async addVideo(videoData)  //向数据库添加新的视频信息
  {
    const { title, description, filename,filepath,user_id,status} = videoData;      //thumbnail是与视频相关联的缩略图文件的信息
    const [result] = await pool.query
    (
      'INSERT INTO videos (title, description, filename,filepath) VALUES (?, ?, ?, ?)',
      [title, description, filename, filepath,user_id,status]
    );
    return result.insertId;
  }
  
  
  /**
   * 删除视频
   * @param {number} id 视频ID
   * @returns {Promise<boolean>} 是否删除成功
   */
  static async deleteVideo(id){
    const [result]= await pool.query( 'DELETE FROM videos WHERE id =?',[id] );
    return result.affectedRows>0;
  }
}

module.exports = Video;