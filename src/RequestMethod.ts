/*
 * @Author: jiangwenjun
 * @Email: jiangwenjun@tuzhanai.com
 * @Date: 2020-09-23 14:14:26
 * @LastEditTime: 2020-09-23 14:14:46
 * @LastEditors: Please set LastEditors
 * @FilePath: \utils-lib\wxpay\src\RequestMethod.ts
 * @Description: 请求的方法
 */
export enum RequestMethod {
  /**
   * 上传实质是 post 请求
   */
  UPLOAD = "POST",
  /**
   * post 请求
   */
  POST = "POST",
  /**
   * get 请求
   */
  GET = "GET",
  /**
   * delete 请求
   */
  DELETE = "DELETE",
  /**
   * put 请求
   */
  PUT = "PUT",
}
