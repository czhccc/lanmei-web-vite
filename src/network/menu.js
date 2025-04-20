import request from './request'

export function _getMenuList(data) {
  return request({
    url: '/menu/getMenuList',
    method: 'get',
    params: data
  });
}