import request from '@/utils/request'

export function fetchOrderList(params) {
  return request({
    url: '/api/order/list',
    method: 'post',
    params
  })
}

export function fetchOrderDetail(params) {
  return request({
    url: '/api/order/detail',
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

export function fetchChangeDetail(params) {
  return request({
    url: '/api/order/changeDetail',
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

export function fetchCheckDetail(params) {
  return request({
    url: '/api/order/receiveDetail',
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

export function fetchReconcileDetail(params) {
  return request({
    url: '/api/statement/detail',
    method: 'post',
    params
  })
}

export function modifyCheckOrder(data) {
  return request({
    url: '/api/order/receiveChangeNum',
    method: 'post',
    data
  })
}

export function verifyCheckOrder(data) {
  return request({
    url: '/api/order/receiveVerify',
    method: 'post',
    data
  })
}

export function generateStatement(data) {
  return request({
    url: '/api/order/produceStatement',
    method: 'post',
    data
  })
}

export function uploadInvoiceData(data) {
  return request({
    url: '/api/statement/upInvoice',
    method: 'post',
    data
  })
}

export function uploadBillData(data) {
  return request({
    url: '/api/statement/upBill',
    method: 'post',
    data
  })
}

export function submitStatement(data) {
  return request({
    url: '/api/statement/push',
    method: 'post',
    data
  })
}

export function rejectStatement(data) {
  return request({
    url: '/api/statement/reject',
    method: 'post',
    data
  })
}

export function uploadWorkImage(data) {
  return request({
    url: '/api/order/upDesign',
    method: 'post',
    data
  })
}

export function applySeal(data) {
  return request({
    url: '/api/statement/applySeal',
    method: 'post',
    data
  })
}

export function uploadWorkFile(data) {
  return request({
    url: '/api/order/upWorks',
    method: 'post',
    data
  })
}

export function packZip(data) {
  return request({
    url: '/api/statement/packZip',
    method: 'post',
    data
  })
}
