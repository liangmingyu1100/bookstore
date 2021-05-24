import { request } from './request'
// 用户注册
export function register(data) {
  return request({
    url: '/api/auth/register',
    method: 'post',
    data
  })
}
// 用户登录
export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}
// 用户退出登录
export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'post',
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/api/user'
  })
}
