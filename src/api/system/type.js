import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/vue-admin-template/system/type/list',
    method: 'post',
    params
  })
}

export function createType(data) {
  return request({
    url: '/vue-element-admin/system/type/create',
    method: 'post',
    data
  })
}

export function updateType(data) {
  return request({
    url: '/vue-element-admin/system/type/update',
    method: 'post',
    data
  })
}
