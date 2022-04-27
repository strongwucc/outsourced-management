import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/vue-admin-template/project/sub/list',
    method: 'post',
    params
  })
}

export function fetchAllSub(params) {
  return request({
    url: '/vue-admin-template/project/sub/all',
    method: 'post',
    params
  })
}

export function createSub(data) {
  return request({
    url: '/vue-element-admin/project/sub/create',
    method: 'post',
    data
  })
}

export function updateSub(data) {
  return request({
    url: '/vue-element-admin/project/sub/update',
    method: 'post',
    data
  })
}
