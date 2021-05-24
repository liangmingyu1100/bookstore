import { request } from './request';
export function getDetailData(goodsId) {
  return request({
    url: '/api/goods/' + goodsId
  })
}