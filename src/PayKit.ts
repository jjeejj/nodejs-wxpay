/*
 * @Author: jiangwenjun
 * @Email: jiangwenjun@tuzhanai.com
 * @Date: 2020-09-23 14:08:45
 * @LastEditTime: 2020-09-24 17:26:15
 * @LastEditors: Please set LastEditors
 * @FilePath: \utils-lib\wxpay\src\PayKit.ts
 * @Description: 微信支付工具类
 *
 * @class WxPayKit
 */
import { Kit } from "./Kit";
import { HttpKit } from "./HttpKit";
import { RequestMethod } from "./RequestMethod";
import * as os from "os";
import * as util from "util";

export class WxPayKit {
  /**
   * 获取认证信息头
   * 认证类型，目前为WECHATPAY2-SHA256-RSA2048
   * 签名信息
   * 发起请求的商户（包括直连商户、服务商或渠道商）的商户号mchid
   * 商户API证书序列号serial_no，用于声明所使用的证书
   * 请求随机串nonce_str
   * 时间戳timestamp
   * 签名值signature
   * 注：以上五项签名信息，无顺序要求。
   * @private
   * @static
   * @param {string} mchId
   * @param {string} serialNo
   * @param {string} nonceStr
   * @param {string} timestamp
   * @param {string} signature
   * @param {string} authType
   * @memberof WxPayKit
   */
  private static getAuthorization(
    mchId: string,
    serialNo: string,
    nonceStr: string,
    timestamp: string,
    signature: string,
    authType: string
  ) {
    let map: Map<string, string> = new Map();
    map.set("mchid", mchId);
    map.set("serial_no", serialNo);
    map.set("nonce_str", nonceStr);
    map.set("timestamp", timestamp);
    map.set("signature", signature);
    return authType.concat(" ").concat(Kit.createMapString(map, true, false, "=", ","));
  }
  /**
   * 构建 v3 接口请求所需要的的签名
   * 使用 Authorizaton 头来传递签名
   * https://wechatpay-api.gitbook.io/wechatpay-api-v3/qian-ming-zhi-nan-1/qian-ming-sheng-cheng
   * @static
   * @param {RequestMethod} method 请求方法
   * @param {string} urlSuffix 可通过 WxApiType 来获取，URL挂载参数需要自行拼接
   * @param {string} mchId 商户号
   * @param {string} serialNo 商户 API 证书序列号
   * @param {Buffer} key key.pem 证书
   * @param {string} body 接口请求参数
   * @memberof WxPayKit
   */
  public static buildAuthorization(
    method: RequestMethod,
    urlSuffix: string,
    mchId: string,
    serialNo: string,
    key: Buffer,
    body: string
  ) {
    let timestamp: string = parseInt((Date.now() / 1000).toString()).toString();
    let nonce: string = Kit.generateStr();

    // 构建请求签名参数
    let buildSignMessage = this.buildReqSignMessage(method, urlSuffix, timestamp, nonce, body);
    // 生成签名
    let signature: string = this.createSignByStr(buildSignMessage, key);
    // 根据平台的规则 生成请求头 Authorization由认证类型和签名信息两个部分组成
    let authType = "WECHATPAY2-SHA256-RSA2048";
    return this.getAuthorization(mchId, serialNo, nonce, timestamp, signature, authType);
  }

  /**
   * 验证 微信响应签名
   * @static
   * @param {string} signature 响应签名
   * @param {string} body 响应头数据
   * @param {string} nonce 响应随机数
   * @param {string} timestamp 响应时间戳
   * @param {Buffer} publicKey 微信平台证书的公钥
   * @returns {boolean}
   * @memberof WxPayKit
   */
  public static verifySignature(
    signature: string,
    body: string,
    nonce: string,
    timestamp: string,
    publicKey: Buffer
  ): boolean {
    let buildSignMessage: string = this.buildRepSignMessage(timestamp, nonce, body);
    return Kit.sha256WithRsaVerify(publicKey, signature, buildSignMessage);
  }
  /**
   * 构建请求签名参数
   * @param method {RequestMethod} Http 请求方式
   * @param url 请求接口 /v3/certificates
   * @param timestamp 获取发起请求时的系统当前时间戳
   * @param nonceStr 随机字符串
   * @param body 请求报文主体
   */
  public static buildReqSignMessage(
    method: RequestMethod,
    url: string,
    timestamp: string,
    nonceStr: string,
    body: string
  ): string {
    return this.buildSignMessage([method, url, timestamp, nonceStr, body]);
  }

  /**
   * 构建响应签名参数
   * @static
   * @param {string} timestamp 应答时间戳
   * @param {string} nonceStr 应答随机串
   * @param {string} body 应答报文主体
   * @returns {string}
   * @memberof WxPayKit
   */
  public static buildRepSignMessage(timestamp: string, nonceStr: string, body: string): string {
    return this.buildSignMessage([timestamp, nonceStr, body]);
  }

  /**
   * 构建签名参数
   * @param {Array<string>} data 待构建签名的参数
   * @returns {string}           返回待签名字符串
   */
  public static buildSignMessage(data: Array<string>): string {
    if (!data || data.length <= 0) {
      throw new Error("待构建签名的参数 不能为空");
    }
    let sign: string = "";
    data.forEach(item => {
      sign = sign.concat(item).concat("\n");
    });
    return sign;
  }

  /**
   * 创建请求签名
   * @static
   * @param {string} data 需要签名的数据
   * @param {Buffer} key 签名的私钥 key.pem
   * @memberof WxPayKit
   */
  public static createSignByStr(data: string, key: Buffer) {
    if (!data) {
      throw new Error("签名数据不能为空");
    }
    return Kit.sha256WithRsa(data, key);
  }

  /**
   * 证书和 回调报文解密
   * @static
   * @param {string} key apiKey3
   * @param {string} nonce 加密使用的随机串初始化向量
   * @param {string} associatedData 附加数据包
   * @param {string} ciphertext 密文
   * @memberof WxPayKit
   */
  public static aes256gcmDecrypt(key: string, nonce: string, associatedData: string, ciphertext: string) {
    return Kit.aes256gcmDecrypt(key, nonce, associatedData, ciphertext);
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
    if (typeof data == "object") {
      data = JSON.stringify(data);
    }
    return Kit.rsaesOAEPEncrypt(Buffer.from(data), publicKey);
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
    return Kit.rsaesOAEPDecrypt(Buffer.from(data), privateKey);
  }
  /**
   * 微信支付 Api-v3 get 请求
   * @static
   * @param {string} urlPrefix 接口地址前缀， 可通过 WX_DOMAIN 获取
   * @param {string} urlSuffix 接口后缀地址 ， 可通过 WX_API_TYPE 获取
   * @param {string} mchId 商户号
   * @param {string} serialNo 商户证书序列号
   * @param {Buffer} key 商户私钥
   * @param {Map<string, string>} [params] 请求参数
   * @returns {Promise<any>} 返回信息
   * @memberof WxPayKit
   */
  public static async execGet(
    urlPrefix: string,
    urlSuffix: string,
    mchId: string,
    serialNo: string,
    key: Buffer,
    params?: Map<string, string>
  ): Promise<any> {
    if (params && params.size > 0) {
      urlSuffix = urlSuffix.concat("?").concat(Kit.createMapString(params, false, true));
    }
    // 获取请求需要的 签名头
    let authorizaton = this.buildAuthorization(RequestMethod.GET, urlSuffix, mchId, serialNo, key, "");
    // 发送请求
    return await this.get(urlPrefix.concat(urlSuffix), authorizaton);
  }

  /**
   * Get 请求
   * @static
   * @param {string} url 请求地址
   * @param {string} authorizaton 请求的签名头信息
   * @returns
   * @memberof WxPayKit
   */
  public static async get(url: string, authorizaton: string) {
    return await HttpKit.getHttpDelegate.httpGetToResponse(url, {
      headers: this.getRequestHeaders(authorizaton),
    });
  }

  /**
   * 微信支付 Api-v3 post 请求
   * @static
   * @param {string} urlPrefix 接口地址前缀， 可通过 WX_DOMAIN 获取
   * @param {string} urlSuffix 接口后缀地址 ， 可通过 WX_API_TYPE 获取
   * @param {string} mchId 商户号
   * @param {string} serialNo 商户证书序列号
   * @param {Buffer} key 商户私钥
   * @param {string} data
   * @returns {Promise<any>}
   * @memberof WxPayKit
   */
  public static async execPost(
    urlPrefix: string,
    urlSuffix: string,
    mchId: string,
    serialNo: string,
    key: Buffer,
    data: string
  ): Promise<any> {
    // 获取请求需要的 签名头
    let authorizaton = this.buildAuthorization(RequestMethod.POST, urlSuffix, mchId, serialNo, key, data);
    return await this.post(urlPrefix.concat(urlSuffix), data, authorizaton);
  }

  /**
   * POST 请求
   * @static
   * @param {string} url 请求地址
   * @param {any} data 发送的数据
   * @param {string} authorizaton 请求的签名头信息
   * @returns
   * @memberof WxPayKit
   */
  public static async post(url: string, data: any, authorizaton: string) {
    return await HttpKit.getHttpDelegate.httpPostToResponse(url, data, {
      headers: this.getRequestHeaders(authorizaton),
    });
  }

  /**
   * 获取请求头
   * @param authorization 授权信息
   */
  private static getRequestHeaders(authorization: string): Object {
    let userAgent: string = "WeChatPay--HttpClient nodejs/%s";
    userAgent = util.format(
      userAgent,
      os
        .platform()
        .concat("/")
        .concat(os.release()),
      process.version
    );
    return {
      Authorization: authorization,
      Accept: "application/json",
      "Content-type": "application/json",
      "User-Agent": userAgent,
    };
  }
}
