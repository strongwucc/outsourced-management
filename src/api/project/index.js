import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/vue-admin-template/project/list',
    method: 'post',
    params
  })
}

export function fetchAllProject(params) {
  return request({
    url: '/vue-admin-template/project/all',
    method: 'post',
    params
  })
}

export function createProject(data) {
  return request({
    url: '/vue-element-admin/project/create',
    method: 'post',
    data
  })
}

export function updateProject(data) {
  return request({
    url: '/vue-element-admin/project/update',
    method: 'post',
    data
  })
}
