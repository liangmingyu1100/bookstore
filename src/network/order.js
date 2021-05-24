import { request } from './request'

// 订单预览
export function createOrder() {
  return request({
    url: '/api/orders/preview',
  })
}

// 提交订单
export function commitOrder(data) {
  return request({
    url: '/api/orders',
    method: 'post',
    data
  })
}

// 获取订单详情
export function getOrderDetail(order_id) {
  return request({
    url: `/api/orders/${order_id}?include=user,orderDetails.goods`,
  })
}

// 获取订单列表
export function getOrderList(page, status) {
  return request({
    url: `/api/orders?include=goods,user,orderDetails&page=${page}&status=${status}`,
  })
}

// 物流详情
export function getTrancesDetail(order_id) {
  return request({
    url: `/api/orders/${order_id}/express`,
  })
}

// 确认收货
export function confirmReceipt(order_id) {
  return request({
    url: `/api/orders/${order_id}/confirm`,
    method: 'patch'
  })
}

// 评价商品
export function commentGoods(order_id, data) {
  return request({
    url: `/api/orders/${order_id}/comment`,
    method: 'post',
    data
  })
}

// 获取二维码
export function getPayCode(order_id, type) {
  return request({
    url: `/api/orders/${order_id}/pay?type=${type}`,
  })
}

// 查询支付状态
export function queryPayStatus(order_id) {
  return request({
    url: `/api/orders/${order_id}/status`,
  })
}