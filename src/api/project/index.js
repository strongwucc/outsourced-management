import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/project/list',
    method: 'post',
    params
  })
}

export function fetchAllProject(params) {
  return request({
    url: '/api/project/queryAll',
    method: 'post',
    params
  })
}

export function createProject(data) {
  return request({
    url: '/api/project/add',
    method: 'post',
    data
  })
}

export function updateProject(data) {
  return request({
    url: '/api/project/changeProjectFunds',
    method: 'post',
    data
  })
}
