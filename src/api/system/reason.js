import request from '@/utils/request'

export function fetchReasonList(params) {
  return request({
    url: '/api/setting/querySupplierReason',
    method: 'post',
    params
  })
}

export function createReason(data) {
  return request({
    url: '/api/setting/addSupplierReason',
    method: 'post',
    data
  })
}

export function updateReason(data) {
  return request({
    url: '/api/setting/addSupplierReason',
    method: 'post',
    data
  })
}

export function deleteReason(data) {
  return request({
    url: '/api/setting/delSupplierReason',
    method: 'post',
    data
  })
}

export function fetchIntentReasonList(params) {
  return request({
    url: '/api/setting/queryPurposeSupplierReason',
    method: 'post',
    params
  })
}

export function createIntentReason(data) {
  return request({
    url: '/api/setting/addPurposeSupplierReason',
    method: 'post',
    data
  })
}

export function updateIntentReason(data) {
  return request({
    url: '/api/setting/addPurposeSupplierReason',
    method: 'post',
    data
  })
}

export function deleteIntentReason(data) {
  return request({
    url: '/api/setting/delPurposeSupplierReason',
    method: 'post',
    data
  })
}
