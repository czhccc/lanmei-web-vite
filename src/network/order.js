import request from './request'

// 获取订单列表
export function _createOrder(data) {
  return request({
    url: '/order/createOrder',
    method: 'post',
    data
  })
}

// 获取订单列表
export function _getOrderList(data) {
  return request({
    url: '/order/getOrderList',
    method: 'get',
    params: data
  })
}

// 查询订单详情
export function _getOrderDetailById(data) {
  return request({
    url: '/order/getOrderDetailById',
    method: 'get',
    params: data
  })
}

// 修改订单
export function _updateOrder(data) {
  return request({
    url: '/order/updateOrder',
    method: 'post',
    data
  })
}

// 获取订单日志列表
export function _getOrderLogsList(data) {
  return request({
    url: '/order/getOrderLogsList',
    method: 'get',
    params: data
  })
}