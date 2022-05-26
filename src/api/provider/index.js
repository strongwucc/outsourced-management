import request from '@/utils/request'

export function fetchRegion(params) {
  return request({
    url: '/api/tools/area',
    method: 'post',
    params
  })
}

export function fetchSubject(params) {
  return request({
    url: '/api/project/subQuery',
    method: 'post',
    params
  })
}

export function fetchList(params) {
  return request({
    url: '/api/supply/queryList',
    method: 'post',
    params
  })
}

export function fetchAllProvider(params) {
  return request({
    url: '/api/supply/queryAll',
    method: 'post',
    params
  })
}

export function createProvider(data) {
  return request({
    url: '/api/supply/add',
    method: 'post',
    data
  })
}

export function updateProvider(data) {
  return request({
    url: '/api/supply/add',
    method: 'post',
    data
  })
}

export function deleteProvider(data) {
  return request({
    url: '/api/supply/del',
    method: 'post',
    data
  })
}
