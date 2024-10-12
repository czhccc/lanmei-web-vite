import request from './request'

// 获取
export function _notify(data) {
  return request({
    url: '/wechat/notify',
    method: 'post',
    data
  });
}

// 更新
export function _getNotificationList(data) {
  return request({
    url: '/wechat/notify',
    method: 'get',
    params: data
  });
}