import request from '@/utils/request'

export function fetchOrderList(params) {
  return request({
    url: '/api/order/list',
    method: 'post',
    params
  })
}

export function addTask(data) {
  return request({
    url: '/api/order/changeTask',
    method: 'post',
    data
  })
}

export function modifyOrder(data) {
  return request({
    url: '/api/order/changeNum',
    method: 'post',
    data
  })
}

export function toCheckOrder(data) {
  return request({
    url: '/api/order/check',
    method: 'post',
    data
  })
}

export function fetchModifyOrderList(params) {
  return request({
    url: '/api/order/changeList',
    method: 'post',
    params
  })
}

export function changeVerify(data) {
  return request({
    url: '/api/order/changeVerify',
    method: 'post',
    data
  })
}

export function fetchCheckOrderList(params) {
  return request({
    url: '/api/order/receiveQuery',
    method: 'post',
    params
  })
}

export function fetchReconcileOrderList(params) {
  return request({
    url: '/api/statement/list',
    method: 'post',
    params
  })
}

export function uploadBillData(data) {
  return request({
    url: '/vue-element-template/order/bill/upload',
    method: 'post',
    data
  })
}
