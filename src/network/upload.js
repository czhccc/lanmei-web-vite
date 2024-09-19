import request from './request'

// 获取评论列表
export function _uploadFile(data) {
  return request({
    url: '/upload',
    method: 'post',
    'Content-Type': 'multipart/form-data',
    data
  });
}