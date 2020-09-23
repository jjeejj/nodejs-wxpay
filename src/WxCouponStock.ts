import { readFileSync } from "fs";
/*
 * @Author: jiangwenjun
 * @Email: jiangwenjun@tuzhanai.com
 * @Date: 2020-09-23 14:05:25
 * @LastEditTime: 2020-09-23 18:07:13
 * @LastEditors: Please set LastEditors
 * @FilePath: \utils-lib\wxpay\src\WxCouponStock.ts
 * @Description: 代金券 API
 */

import { WxPayKit } from "./PayKit";
import { WX_API_TYPE } from "./WxApiType";
import { WX_DOMAIN } from "./WxDomain";

/**
 * 发放代金券 接口参数
 * @interface SEND_COUPONS
 */
interface SEND_COUPONS {
  stock_id: string;
  out_request_no: string;
  appid: string;
  stock_creator_mchid: string;
  coupon_value?: number;
  coupon_minimum?: number;
}

/**
 * 设置回调 地址的请求参数
 * @interface CALLBACK_URL
 */
interface CALLBACK_URL {
  mchid: string; // 商户号
  notify_url: string; //支付通知商户url地址
  switch?: boolean; // 如果商户不需要再接收营销事件通知，可通过该开关关闭
}
export class WxCouponStock {
  public static async sendCoupons(body: SEND_COUPONS, openid: string, mchId: string, serialNo: string, key: Buffer) {
    return await WxPayKit.execPost(
      WX_DOMAIN.CHINA,
      WX_API_TYPE.SEND_COUPON.replace("{openid}", openid),
      mchId,
      serialNo,
      key,
      JSON.stringify(body)
    );
  }

  /**
   * 设置接收营销事件通知的URL，可接收营销相关的事件通知，包括核销、发放、退款等
   * @static
   * @param {CALLBACK_URL} body 请求参数
   * @param {string} mchId 商户号 ID
   * @param {string} serialNo 证书序列号
   * @param {Buffer} key 私钥
   * @returns
   * @memberof WxCouponStock
   */
  public static async setCallBackUrl(body: CALLBACK_URL, mchId: string, serialNo: string, key: Buffer) {
    return await WxPayKit.execPost(
      WX_DOMAIN.CHINA,
      WX_API_TYPE.SET_MARKETING_CALLBACK_URL,
      mchId,
      serialNo,
      key,
      JSON.stringify(body)
    );
  }
}
