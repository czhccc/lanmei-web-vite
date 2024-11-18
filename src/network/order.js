import request from './request'

// 创建或更新商品
export function _getOrderList(data) {
  return request({
    url: '/order/getOrderList',
    method: 'get',
    params: data
  })
}