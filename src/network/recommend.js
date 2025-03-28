import request from './request'

// 获取
export function _editRecommendList(data) {
  return request({
    url: '/wechat/recommend',
    method: 'post',
    data
  });
}

// 更新
export function _getRecommendList(data) {
  return request({
    url: '/wechat/recommend',
    method: 'get',
    params: data
  });
}