import request from './request'

// 创建或更新商品
export function _createOrUpdateGoods(data) {
  return request({
    url: '/goods',
    method: 'post',
    data
  })
}

// 获取商品详情
export function _getGoodsDetailById(data) {
  return request({
    url: '/goods/getGoodsDetailById',
    method: 'get',
    params: data
  })
}

// 获取现货批次库存
export function _getGoodsStockRemainingQuantityFromRedis(data) {
  return request({
    url: '/goods/getGoodsStockRemainingQuantityFromRedis',
    method: 'get',
    params: data
  })
}

// 获取商品列表
export function _getGoodsList(data) {
  return request({
    url: '/goods/getGoodsList',
    method: 'get',
    params: data
  })
}

// 结束当前批次
export function _endCurrentBatch(data) {
  return request({
    url: '/goods/endCurrentBatch',
    method: 'post',
    data
  });
}

// 改变上架状态
export function _changeGoodsIsSelling(data) {
  return request({
    url: '/goods/changeGoodsIsSelling',
    method: 'post',
    data
  });
}

// 获取历史批次列表
export function _getHistoryBatchesList(data) {
  return request({
    url: '/goods/getHistoryBatchesList',
    method: 'get',
    params: data
  });
}

// 获取商品批次总计
export function _getBatchOrdersStatistic(data) {
  return request({
    url: '/goods/getBatchOrdersStatistic',
    method: 'get',
    params: data
  });
}

// 删除当前批次
export function _deleteCurrentBatch(data) {
  return request({
    url: '/goods/deleteCurrentBatch',
    method: 'delete',
    data
  });
}

// 取消当前批次所有订单
export function _cancelAllOrdersInCurrentBatch(data) {
  return request({
    url: '/goods/cancelAllOrdersInCurrentBatch',
    method: 'post',
    data
  });
}

// 预订批次开始售卖
export function _preorderBatchIsReadyToSell(data) {
  return request({
    url: '/goods/preorderBatchIsReadyToSell',
    method: 'post',
    data
  });
}

