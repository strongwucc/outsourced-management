import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/needs/queryList',
    method: 'post',
    params,
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

export function rejectDemand(data) {
  return request({
    url: '/api/needs/rejectDemand',
    method: 'post',
    data
  })
}

export function toVerifyTask(data) {
  return request({
    url: '/api/needs/toVerifyTask',
    method: 'post',
    data
  })
}

export function createOrder(data) {
  return request({
    url: '/api/needs/createOrder',
    method: 'post',
    data
  })
}

export function verifyOrder(data) {
  return request({
    url: '/api/needs/verifyOrder',
    method: 'post',
    data
  })
}

export function exportTaskTpl(demand_id) {
  return request({
    url: '/api/needs/exportTaskTpl',
    method: 'get',
    params: { demand_id },
    responseType: 'arraybuffer'
  })
}

export function batchAddTasks(data) {
  return request({
    url: '/api/needs/batchAddTasks',
    method: 'post',
    data
  })
}

export function uploadDemandPaperclip(data) {
  return request({
    url: '/api/needs/upFile',
    method: 'post',
    data
  })
}

export function toFinishDemand(data) {
  return request({
    url: '/api/needs/close',
    method: 'post',
    data
  })
}

export function toRefuseDemand(data) {
  return request({
    url: '/api/needs/refuse',
    method: 'post',
    data
  })
}

export function exportTask(demand_id) {
  return request({
    url: '/api/needs/exportTask',
    method: 'get',
    params: { demand_id },
    responseType: 'arraybuffer'
  })
}

export function editCatTagReason(data) {
  return request({
    url: '/api/needs/editCatTagReason',
    method: 'post',
    data
  })
}