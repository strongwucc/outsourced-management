import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/vue-admin-template/demand/list',
    method: 'post',
    params
  })
}

export function fetchDemandDetail(params) {
  return request({
    url: '/vue-admin-template/demand/detail',
    method: 'post',
    params
  })
}

export function createDemand(data) {
  return request({
    url: '/vue-element-admin/demand/create',
    method: 'post',
    data
  })
}

export function updateDemand(data) {
  return request({
    url: '/vue-element-admin/demand/update',
    method: 'post',
    data
  })
}
