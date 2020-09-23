/*
 * @Author: jiangwenjun
 * @Email: jiangwenjun@tuzhanai.com
 * @Date: 2020-09-23 11:51:04
 * @LastEditTime: 2020-09-23 17:53:55
 * @LastEditors: Please set LastEditors
 * @FilePath: \utils-lib\wxpay\src\WxApiType.ts
 * @Description: 微信 v3 接口地址 ，使用的时候需替换对应的 {} 占位符变量
 */
export enum WX_API_TYPE {
  /**
   * 获取平台证书列表
   */
  GET_CERTIFICATES = "/v3/certificates",

  /**
   * ============================================
   *            代金券相关的 API
   * ============================================
   */

  /**
   * 创建代金券批次
   */
  CREATE_COUPON_STOCKS = "/v3/marketing/favor/coupon-stocks",

  /**
   * 激活代金券批次
   */
  START_COUPON_STOCKS = "/v3/marketing/favor/stocks/{stock_id}/start",

  /**
   * 暂停代金券批次
   */
  PAUSE_COUPON_STOCKS = "/v3/marketing/favor/stocks/{stock_id}/pause",

  /**
   * 发放代金券
   */
  SEND_COUPON = "/v3/marketing/favor/users/{openid}/coupons",

  /**
   * 用于设置接收营销事件通知的URL，可接收营销相关的事件通知，包括核销、发放、退款等
   */
  SET_MARKETING_CALLBACK_URL = "/v3/marketing/favor/callbacks",
}
