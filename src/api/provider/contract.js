import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/vue-admin-template/provider/contract/list',
    method: 'post',
    params
  })
}

export function createContract(data) {
  return request({
    url: '/vue-element-admin/provider/contract/create',
    method: 'post',
    data
  })
}

export function updateContract(data) {
  return request({
    url: '/vue-element-admin/provider/contract/update',
    method: 'post',
    data
  })
}

export function recoverContract(data) {
  return request({
    url: '/vue-element-admin/provider/contract/recover',
    method: 'post',
    data
  })
}

export function pauseContract(data) {
  return request({
    url: '/vue-element-admin/provider/contract/pause',
    method: 'post',
    data
  })
}
