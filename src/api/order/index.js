import request from '@/utils/request'

export function fetchOrderList(params) {
  return request({
    url: '/vue-admin-template/order/list',
    method: 'post',
    params
  })
}

export function fetchModifyOrderList(params) {
  return request({
    url: '/vue-admin-template/order/modify/list',
    method: 'post',
    params
  })
}

export function fetchCheckOrderList(params) {
  return request({
    url: '/vue-admin-template/order/check/list',
    method: 'post',
    params
  })
}

export function fetchReconcileOrderList(params) {
  return request({
    url: '/vue-admin-template/order/reconcile/list',
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
