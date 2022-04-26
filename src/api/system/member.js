import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/vue-admin-template/system/member/list',
    method: 'post',
    params
  })
}

export function fetchAllDepartment(params) {
  return request({
    url: '/vue-admin-template/system/member/all',
    method: 'post',
    params
  })
}

export function createMember(data) {
  return request({
    url: '/vue-element-admin/system/member/create',
    method: 'post',
    data
  })
}

export function updateMember(data) {
  return request({
    url: '/vue-element-admin/system/member/update',
    method: 'post',
    data
  })
}
