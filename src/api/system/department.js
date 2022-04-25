import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/vue-admin-template/system/department/list',
    method: 'post',
    params
  })
}

export function fetchAllDepartment(params) {
  return request({
    url: '/vue-admin-template/system/department/all',
    method: 'post',
    params
  })
}

export function createDepartment(data) {
  return request({
    url: '/vue-element-admin/system/department/create',
    method: 'post',
    data
  })
}

export function updateDepartment(data) {
  return request({
    url: '/vue-element-admin/system/department/update',
    method: 'post',
    data
  })
}
