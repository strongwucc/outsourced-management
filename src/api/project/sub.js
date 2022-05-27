import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/project/subQuery',
    method: 'post',
    params
  })
}

export function fetchAllSub(params) {
  return request({
    url: '/api/project/subAll',
    method: 'post',
    params
  })
}

export function createSub(data) {
  return request({
    url: '/api/project/subAdd',
    method: 'post',
    data
  })
}

export function updateSub(data) {
  return request({
    url: '/api/project/subAdd',
    method: 'post',
    data
  })
}

export function deleteSub(data) {
  return request({
    url: '/api/project/subDel',
    method: 'post',
    data
  })
}
