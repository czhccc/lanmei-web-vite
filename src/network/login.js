import request from './request'

// 登录
export function _login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  });
}

// 登出
export function _logout(data) {
  return request({
    url: '/auth/logout',
    method: 'post',
    data
  });
}