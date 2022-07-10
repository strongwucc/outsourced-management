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

export function fetchProcessCategory(params) {
  return request({
    url: '/api/project/processCategory',
    method: 'post',
    params
  })
}

export function fetchProcessVerifyMember(params) {
  return request({
    url: '/api/project/processVerifyMember',
    method: 'post',
    params
  })
}

export function deleteProcess(data) {
  return request({
    url: '/api/project/delProcess',
    method: 'post',
    data
  })
}
