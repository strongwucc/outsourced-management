import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/vue-admin-template/system/email/list',
    method: 'post',
    params
  })
}

export function createEmail(data) {
  return request({
    url: '/vue-element-admin/system/email/create',
    method: 'post',
    data
  })
}

export function updateEmail(data) {
  return request({
    url: '/vue-element-admin/system/email/update',
    method: 'post',
    data
  })
}
