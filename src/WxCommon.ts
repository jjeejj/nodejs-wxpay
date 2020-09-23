/*
 * @Author: jiangwenjun
 * @Email: jiangwenjun@tuzhanai.com
 * @Date: 2020-09-23 15:46:20
 * @LastEditTime: 2020-09-23 18:09:06
 * @LastEditors: Please set LastEditors
 * @FilePath: \utils-lib\wxpay\src\WxCommon.ts
 * @Description: 公共的接口方法
 */
import { WxPayKit } from "./PayKit";
import { WX_API_TYPE } from "./WxApiType";
import { WX_DOMAIN } from "./WxDomain";
import { readFileSync } from "fs";

export class WxCommon {
  /**
   * 获取平台证书列表
   * @static
   * @param {string} mchId
   * @param {string} serialNo
   * @param {Buffer} key
   * @returns {Promise<any>}
   * @memberof WxCommon
   */
  public static async getCertifucates(mchId: string, serialNo: string, key: Buffer): Promise<any> {
    return await WxPayKit.execGet(WX_DOMAIN.CHINA, WX_API_TYPE.GET_CERTIFICATES, mchId, serialNo, key);
  }

  /**
   * 证书和回调报文解密
   * @static
   * @param {string} key apiKey3
   * @param {string} nonce 加密使用的随机串初始化向量
   * @param {string} associatedData 附加数据包
   * @param {string} ciphertext 密文
   * @returns
   * @memberof WxCommon
   */
  public static aes256gcmDecrypt(key: string, nonce: string, associatedData: string, ciphertext: string) {
    return WxPayKit.aes256gcmDecrypt(key, nonce, associatedData, ciphertext);
  }
}
