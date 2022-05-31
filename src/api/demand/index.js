import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/needs/queryList',
    method: 'post',
    params
  })
}

export function fetchDemandDetail(params) {
  return request({
    url: '/api/needs/detail',
    method: 'post',
    params
  })
}

export function createDemand(data) {
  return request({
    url: '/api/needs/create',
    method: 'post',
    data
  })
}

export function updateDemand(data) {
  return request({
    url: '/api/needs/create',
    method: 'post',
    data
  })
}
