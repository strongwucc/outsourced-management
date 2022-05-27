import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/project/processList',
    method: 'post',
    params
  })
}

export function createProcess(data) {
  return request({
    url: '/api/project/createProcess',
    method: 'post',
    data
  })
}

export function fetchDetail(data) {
  return request({
    url: '/api/project/processDetail',
    method: 'post',
    data
  })
}

export function fetchAllProcess(params) {
  return request({
    url: '/api/project/processAll',
    method: 'post',
    params
  })
}
