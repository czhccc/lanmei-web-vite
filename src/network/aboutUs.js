import request from './request'

// 获取
export function _getAboutUs(data) {
  return request({
    url: '/aboutUs',
    method: 'get',
    data
  });
}

// 更新
export function _updateAboutUs(data) {
  return request({
    url: '/aboutUs',
    method: 'post',
    data
  });
}