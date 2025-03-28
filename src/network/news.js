import request from './request'

export function _getNewsList(data) {
  return request({
    url: '/wechat/news/list',
    method: 'get',
    params: data
  });
}

export function _getNewsDetail(data) {
  return request({
    url: '/wechat/news/detail',
    method: 'get',
    params: data
  });
}

export function _addNews(data) {
  return request({
    url: '/wechat/news/add',
    method: 'post',
    data
  });
}

export function _editNews(data) {
  return request({
    url: '/wechat/news/edit',
    method: 'post',
    data
  });
}

export function _deleteNews(data) {
  return request({
    url: '/wechat/news/delete',
    method: 'post',
    data
  });
}

export function _showNews(data) {
  return request({
    url: '/wechat/news/show',
    method: 'post',
    data
  });
}

export function _pinNews(data) {
  return request({
    url: '/wechat/news/pin',
    method: 'post',
    data
  });
}