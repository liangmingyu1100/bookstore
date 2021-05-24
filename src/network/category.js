import { request } from './request'
export function getCategorysData() {
  return request({
    url: '/api/goods'
  })
}
export function getCategorysGoods(type = 'sales', cid = 0, page = 1) {
  return request({
    url: '/api/goods?' + type + '=1&page' + page + '&category_id=' + cid
  })
}