import request from './request'

// 获取管理员列表
export function _getAdminList(data) {
  return request({
    url: '/admin',
    method: 'get',
    params: data
  });
}

// 新增管理员
export function _createOrUpdateAdmin(data) {
  return request({
    url: '/admin',
    method: 'post',
    data
  });
}

// 删除管理员
export function _deleteAdmin(data) {
  return request({
    url: '/admin',
    method: 'delete',
    params: data
  });
}