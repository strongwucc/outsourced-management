import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/vue-admin-template/system/role/list',
    method: 'post',
    params
  })
}

export function fetchAllRole(params) {
  return request({
    url: '/vue-admin-template/system/role/all',
    method: 'post',
    params
  })
}

export function updateRole(data) {
  return request({
    url: '/vue-element-admin/system/role/update',
    method: 'post',
    data
  })
}
