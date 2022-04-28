import request from '@/utils/request'

export function fetchRegion(params) {
  return request({
    url: '/vue-admin-template/region/all',
    method: 'post',
    params
  })
}

export function fetchSubject(params) {
  return request({
    url: '/vue-admin-template/subject/all',
    method: 'post',
    params
  })
}

export function fetchList(params) {
  return request({
    url: '/vue-admin-template/provider/list',
    method: 'post',
    params
  })
}

export function fetchAllProvider(params) {
  return request({
    url: '/vue-admin-template/provider/all',
    method: 'post',
    params
  })
}

export function createProvider(data) {
  return request({
    url: '/vue-element-admin/provider/create',
    method: 'post',
    data
  })
}

export function updateProvider(data) {
  return request({
    url: '/vue-element-admin/provider/update',
    method: 'post',
    data
  })
}
