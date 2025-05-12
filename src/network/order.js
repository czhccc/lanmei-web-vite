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
export function _getOrdersLogsList(data) {
  return request({
    url: '/order/getOrdersLogsList',
    method: 'get',
    params: data
  })
}

// 取消订单
export function _cancelOrder(data) {
  return request({
    url: '/order/cancelOrder',
    method: 'post',
    data
  })
}

// 关闭订单
export function _closeOrder(data) {
  return request({
    url: '/order/closeOrder',
    method: 'post',
    data
  })
}

// 发货订单
export function _shipOrder(data) {
  return request({
    url: '/order/shipOrder',
    method: 'post',
    data
  })
}

// 完结订单
export function _completeOrder(data) {
  return request({
    url: '/order/completeOrder',
    method: 'post',
    data
  })
}