import request from './request'

// 获取评论列表
export function _getCommentList(data) {
  return request({
    url: '/getCommentList',
    method: 'get',
    data
  });
}

// 更新
// export function _updateAboutUs(data) {
//   return request({
//     url: '/aboutUs',
//     method: 'post',
//     data
//   });
// }