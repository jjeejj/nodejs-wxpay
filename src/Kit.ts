/*
 * @Author: jiangwenjun
 * @Email: jiangwenjun@tuzhanai.com
 * @Date: 2020-09-23 14:13:51
 * @LastEditTime: 2020-09-23 16:57:02
 * @LastEditors: Please set LastEditors
 * @FilePath: \utils-lib\wxpay\src\Kit.ts
 * @Description: 基础的工具方法
 */
import * as uuid from "uuid";
import * as crypto from "crypto";
export class Kit {
  /**
   * 随机生成字符串
   */
  public static generateStr(): string {
    return uuid.v4().replace(/\-/g, "");
  }

  /**
   * 使用 SHA256 with RSA 签名 并生成 Base64 编码
   * @static
   * @param {string} data 需要签名的数据
   * @param {Buffer} privateKey 私钥
   * @memberof Kit
   */
  public static sha256WithRsa(data: string, privateKey: Buffer): string {
    return crypto
      .createSign("RSA-SHA256")
      .update(data)
      .sign(privateKey, "base64");
  }

  /**
   * 使用 SHA256 with RSA 验证签名
   * @static
   * @param {Buffer} publicKey 公钥
   * @param {string} signature 待验证的签名
   * @param {string} data 需要验证的字符串
   * @memberof Kit
   */
  public static sha256WithRsaVerify(publicKey: Buffer, signature: string, data: string) {
    return crypto
      .createVerify("RSA-SHA256")
      .update(data)
      .verify(publicKey, signature, "base64");
  }

  /**
   * AEAD_AES_256_GCM 解密
   * @static
   * @param {string} key 解密的 key
   * @param {string} nonce 解密的随机向量
   * @param {string} associatedData 附加文本
   * @param {string} ciphertext 待解密的数据
   * @memberof Kit
   */
  public static aes256gcmDecrypt(key: string, nonce: string, associatedData: string, ciphertext: string) {
    let ciphertextBuffer = Buffer.from(ciphertext, "base64");
    let authTag = ciphertextBuffer.slice(ciphertextBuffer.length - 16);
    let data = ciphertextBuffer.slice(0, ciphertextBuffer.length - 16);

    let decipherIv = crypto.createDecipheriv("aes-256-gcm", key, nonce);
    decipherIv.setAuthTag(authTag);
    decipherIv.setAAD(Buffer.from(associatedData));
    let decryptStr = decipherIv.update(data, undefined, "utf8");
    decipherIv.final();
    return decryptStr;
  }

  /**
   * 拼接 Map 对象 成字符串
   * @static
   * @param {Map<string, string>} map 待拼接的 Map 对象
   * @param {boolean} encode map 的 value 是否 urlencode 编码
   * @param {boolean} quotes map 的 value 是否 包含双引号 ""
   * @param {string} eq 分隔键和值的子字符串 默认值: '='
   * @param {string} sep 分隔键值对的子字符串。默认值: '&'
   * @memberof Kit
   */
  public static createMapString(
    map: Map<string, string>,
    quotes: boolean = false,
    encode: boolean = false,
    eq: string = "=",
    sep: string = "&"
  ): string {
    let content: string = "";
    let arrayMapObj = Array.from(map);
    for (let i = 0; i < arrayMapObj.length; i++) {
      let key = arrayMapObj[i][0];
      let value = arrayMapObj[i][1];
      content = this.concatStr(content, key, value, eq, sep, quotes, encode, i == arrayMapObj.length - 1);
    }
    return content;
  }

  public static concatStr(
    content: string,
    key: string,
    value: string,
    eq: string,
    sep: string,
    quotes: boolean,
    encode: boolean,
    isEnd: boolean
  ) {
    if (quotes) {
      content = content
        .concat(key)
        .concat(eq)
        .concat('"')
        .concat(encode ? encodeURIComponent(value) : value)
        .concat('"');
    } else {
      content = content
        .concat(key)
        .concat(eq)
        .concat(encode ? encodeURIComponent(value) : value);
    }
    return !isEnd ? content.concat(sep) : content;
  }
}
