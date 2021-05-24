import { request } from './request'
//添加购物车 
export function addCart(goods_id, num = 1) {
  return request({
    url: '/api/carts',
    method: 'post',
    data: {
      goods_id,
      num
    }
  })
}

// 获取购物车列表
export function getCartList(data = '') {
  return request({
    url: '/api/carts?' + data,
  })
}

// 修改购物车数量
export function modifyCartCount(id, num) {
  return request({
    url: '/api/carts/' + id,
    method: 'put',
    data: {
      num
    }
  })
}

//移除购物车
export function removeCart(id) {
  return request({
    url: `/api/carts/${id}`,
    method: 'delete'
  })
}

// 改变购物车的选中
export function checkedCart(data) {
  return request({
    url: `/api/carts/checked`,
    method: 'PATCH',
    data
  })
}