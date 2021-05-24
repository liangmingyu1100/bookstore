import axios from 'axios'
import { Toast } from 'vant'
import router from '../router'
export function request(congif) {
  // 创建axios实例
  const instance = axios.create({
    baseURL: 'https://api.shop.eduwork.cn',
    timeout: 5000
  })

  //请求拦截
  instance.interceptors.request.use(congif => {
    //当我们需要对请求头进行操作时，在此操作
    const token = window.localStorage.getItem('token');
    if (token) {
      congif.headers.Authorization = 'Bearer ' + token;
    }
    // 直接放行
    return congif
  }, err => {
    throw err
  })

  // 响应拦截
  instance.interceptors.response.use(res => {
    // console.log(res);
    return res.data ? res.data : res
  }, err => {
    console.log(err);
    // 对响应状态码进行判断
    if (err.response.status == '401') {
      Toast.fail('请先登录');
      router.push({ path: '/login' });
    }
    Toast.fail(err.response.data.errors[Object.keys(err.response.data.errors)[0]][0])
    console.log(err.response.data.errors[Object.keys(err.response.data.errors)[0]][0]);
  })

  return instance(congif)
}