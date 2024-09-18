import request from './request'

// 获取评论列表
export function _createOrUpdateGoods(data) {
  return request({
    url: '/goods',
    method: 'post',
    data
  });
}