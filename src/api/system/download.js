import request from '@/utils/request'

export function exportOrders(params) {
  return request({
    url: '/api/download/order',
    method: 'get',
    params,
    responseType: 'arraybuffer'
  })
}
