import request from './request'

// 获取评论列表
export function _getCommentList(data) {
  return request({
    url: '/comment/getCommentList',
    method: 'get',
    params: data
  });
}

// 获取评论详情
export function _getCommentDetailById(data) {
  return request({
    url: '/comment/getCommentDetailById',
    method: 'get',
    params: data
  });
}


// 评论
export function _response(data) {
  return request({
    url: '/comment/response',
    method: 'post',
    data
  });
}