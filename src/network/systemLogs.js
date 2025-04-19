import request from './request'

export function _getSystemLogsList(data) {
  return request({
    url: '/systemLogs/list',
    method: 'get',
    params: data
  });
}

export function _deleteSystemLogs(data) {
  return request({
    url: '/systemLogs/deleteSystemLogs',
    method: 'post',
    data
  });
}

export function _deleteSystemLogsByTime(data) {
  return request({
    url: '/systemLogs/deleteSystemLogsByTime',
    method: 'post',
    data
  });
}
