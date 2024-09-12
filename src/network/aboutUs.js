import request from './request'

// 获取管理员列表
export function _updateAboutUs(data) {
  return request({
    url: '/aboutUs',
    method: 'post',
    data
  });
}