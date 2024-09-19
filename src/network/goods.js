import request from './request'

// 创建或更新商品
export function _createOrUpdateGoods(data) {
  return request({
    url: '/goods',
    method: 'post',
    data
  });
}

// 获取商品详情
export function _getGoodsDetailById(data) {
  return request({
    url: '/goods/getGoodsDetailById',
    method: 'get',
    params: data
  });
}

// 获取商品列表
export function _getGoodsList(data) {
  return request({
    url: '/goods/getGoodsList',
    method: 'get',
    params: data
  });
}