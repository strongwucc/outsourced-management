import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/supply/queryPact',
    method: 'post',
    params
  })
}

export function fetchAllPact(params) {
  return request({
    url: '/api/supply/queryAllPact',
    method: 'post',
    params
  })
}

export function createContract(data) {
  return request({
    url: '/api/supply/addPact',
    method: 'post',
    data
  })
}

export function updateContract(data) {
  return request({
    url: '/api/supply/addPact',
    method: 'post',
    data
  })
}

export function changeContractStatus(data) {
  return request({
    url: '/api/supply/editPactStatus',
    method: 'post',
    data
  })
}
