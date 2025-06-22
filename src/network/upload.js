import request from './request'

export function _uploadFile(data) {
  return request({
    url: '/upload',
    method: 'post',
    'Content-Type': 'multipart/form-data',
    data
  });
}

export function _getCOSTemporaryKey(data) {
  return request({
    url: '/upload/getCOSTemporaryKey',
    method: 'get',
    params: data
  });
}

export function _handleCOSUrl(data) {
  return request({
    url: '/handleCOSUrl',
    method: 'get',
    params: data,
    responseType: 'blob',
  });
}