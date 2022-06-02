import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/needs/queryList',
    method: 'post',
    params
  })
}

export function fetchDemandDetail(params) {
  return request({
    url: '/api/needs/detail',
    method: 'post',
    params
  })
}

export function createDemand(data) {
  return request({
    url: '/api/needs/create',
    method: 'post',
    data
  })
}

export function updateDemand(data) {
  return request({
    url: '/api/needs/create',
    method: 'post',
    data
  })
}

export function deleteDemand(data) {
  return request({
    url: '/api/needs/delDemand',
    method: 'post',
    data
  })
}

export function toVerifyDemand(data) {
  return request({
    url: '/api/needs/toVerify',
    method: 'post',
    data
  })
}

export function verifyDemand(data) {
  return request({
    url: '/api/needs/verify',
    method: 'post',
    data
  })
}

export function assignSupplier(data) {
  return request({
    url: '/api/needs/choiceSupplier',
    method: 'post',
    data
  })
}
