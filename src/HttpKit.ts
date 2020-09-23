/*
 * @Author: jiangwenjun
 * @Email: jiangwenjun@tuzhanai.com
 * @Date: 2020-09-23 16:04:53
 * @LastEditTime: 2020-09-23 16:58:14
 * @LastEditors: Please set LastEditors
 * @FilePath: \utils-lib\wxpay\src\HttpKit.ts
 * @Description: 发送 HTTP 请求的工具方法
 */
import { AxiosHttpKit } from "./AxiosHttpKit";
export class HttpKit {
  private static delegate: HttpDelegate = new AxiosHttpKit();

  public static get getHttpDelegate(): HttpDelegate {
    return this.delegate;
  }

  public static set setHttpDelegate(delegate: HttpDelegate) {
    this.delegate = delegate;
  }
}

export interface HttpDelegate {
  httpGet(url: string, options?: any): Promise<any>;
  httpGetToResponse(url: string, options?: any): Promise<any>;
  httpPost(url: string, data: string, options?: any): Promise<any>;
  httpPostToResponse(url: string, data: string, options?: any): Promise<any>;
  httpDeleteToResponse(url: string, options?: any): Promise<any>;
  httpPostWithCert(url: string, data: string, certFileContent: Buffer, passphrase: string): Promise<any>;
  // upload(url: string, filePath: string, params?: string): Promise<any>;
  // uploadToResponse(url: string, filePath: string, data: string, options?: any): Promise<any>;
  httpPutToResponse(url: string, data: string, options?: any): Promise<any>;
}
