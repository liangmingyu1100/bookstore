import { request } from './request'

// 添加地址
export function addAddress(addressInfo) {
  return request({
    url: '/api/address',
    method: 'post',
    data: {
      name: addressInfo.name,
      address: addressInfo.addressDetail,
      phone: addressInfo.tel,
      province: addressInfo.province,
      county: addressInfo.county,
      city: addressInfo.city,
      is_default: Number(addressInfo.isDefault)
    }
  })
}

// 获取地址列表
export function getAddressList() {
  return request({
    url: '/api/address',
  })
}

// 获取地址详情
export function getAddressDetail(address_id) {
  return request({
    url: `/api/address/${address_id}`,
  })
}

// 更新地址
export function modifyAddress(address_id, addressInfo) {
  return request({
    url: `/api/address/${address_id}`,
    method: 'put',
    data: {
      name: addressInfo.name,
      address: addressInfo.addressDetail,
      phone: addressInfo.tel,
      province: addressInfo.province,
      county: addressInfo.county,
      city: addressInfo.city,
      is_default: Number(addressInfo.isDefault)
    }
  })
}

// 删除地址
export function removeAddress(address_id) {
  return request({
    url: `/api/address/${address_id}`,
    method: 'delete',
  })
}

// 设置默认地址
export function setDefaultAddress(address_id) {
  return request({
    url: `/api/address/${address_id}/default`,
    method: 'patch'
  })
}
