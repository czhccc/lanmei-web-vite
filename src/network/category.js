import request from './request'

// 获取
export function _updateCategory(data) {
  return request({
    url: '/category',
    method: 'post',
    data
  });
}

// 更新
export function _getCategory(data) {
  return request({
    url: '/category',
    method: 'get',
    params: data
  });
}