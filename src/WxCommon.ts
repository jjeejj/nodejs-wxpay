/*
 * @Author: jiangwenjun
 * @Email: jiangwenjun@tuzhanai.com
 * @Date: 2020-09-23 15:46:20
 * @LastEditTime: 2020-09-24 17:29:17
 * @LastEditors: Please set LastEditors
 * @FilePath: \utils-lib\wxpay\src\WxCommon.ts
 * @Description: 公共的接口方法
 */
import { WxPayKit } from "./PayKit";
import { WX_API_TYPE } from "./WxApiType";
import { WX_DOMAIN } from "./WxDomain";

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

  /**
   * 验证 微信响应的签名是否正确
   * @static
   * @param {(string | object)} body 响应头数据
   * @param {Buffer} publicKey 微信平台证书的公钥
   * @param {*} headersOrSignature 响应头
   * @returns {boolean}
   * @memberof WxCommon
   */
  public static verifySignature(body: string | object, publicKey: Buffer, headersOrSignature: any): boolean;

  /**
   * 验证 微信响应的签名是否正确
   * @static
   * @param {(string | object)} body 响应头数据
   * @param {Buffer} publicKey 微信平台证书的公钥
   * @param {*} headersOrSignature 响应签名
   * @param {string} nonce 响应随机数
   * @param {string} timestamp 响应时间戳
   * @returns {boolean}
   * @memberof WxCommon
   */
  public static verifySignature(
    body: string | object,
    publicKey: Buffer,
    headersOrSignature: any,
    nonce: string,
    timestamp: string
  ): boolean;
  public static verifySignature(
    body: string,
    publicKey: Buffer,
    headersOrSignature: any,
    nonce?: string,
    timestamp?: string
  ): boolean {
    // 若请求体为object 则转化为 String
    if (typeof body == "object") {
      body = JSON.stringify(body);
    }
    if (!timestamp) {
      // 不存在 timestamp
      timestamp = headersOrSignature["wechatpay-timestamp"];
      nonce = headersOrSignature["wechatpay-nonce"];
      headersOrSignature = headersOrSignature["wechatpay-signature"];
    }
    return WxPayKit.verifySignature(headersOrSignature, body, nonce!, timestamp!, publicKey);
  }

  /**
   * 加密敏感信息
   * @static
   * @param {(string | object)} data 待加密的数据
   * @param {Buffer} publicKey 微信平台证书的公钥
   * @returns {string}
   * @memberof WxCommon
   */
  public static encodeSensitiveData(data: string | object, publicKey: Buffer): string {
    try {
      return WxPayKit.encodeSensitiveData(data, publicKey);
    } catch (err) {
      throw new Error("加密敏感信失败: " + err.message);
    }
  }

  /**
   * 加密敏感信息
   * @static
   * @param {string} data 待解密的数据
   * @param {Buffer} privateKey 商户平台证书的是私钥
   * @returns {string}
   * @memberof WxCommon
   */
  public static decodeSensitiveData(data: string, privateKey: Buffer): string {
    try {
      return WxPayKit.decodeSensitiveData(data, privateKey);
    } catch (err) {
      throw new Error("解密敏感信失败: " + err.message);
    }
  }
}
