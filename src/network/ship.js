import request from './request'

// 获取评论列表
export function _getAll(data) {
  return request({
    url: '/ship/getAll',
    method: 'get',
    params: data
  });
}

// 获取评论列表
export function _changeUsable(data) {
  return request({
    url: '/ship/changeUsable',
    method: 'post',
    data
  });
}

// 获取上一批次的邮费配置
export function _getPostageOfLastBatch(data) {
  return request({
    url: '/ship/getPostageOfLastBatch',
    method: 'get',
    params: data
  });
}