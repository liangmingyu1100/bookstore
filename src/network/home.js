import { request } from './request'
export function getHomeData() {
  // 返回Promise对象方便处理
  return request({
    url: '/api/index'
  })
}
export function getHomeGoods(type, page) {
  // 返回Promise对象方便处理
  return request({
    url: '/api/index?' + type + '=1&page=' + page,
  })
}