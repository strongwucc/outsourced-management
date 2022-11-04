import request from '@/utils/request'

export function sendCode(data) {
  return request({
    url: '/api/tools/sendCode',
    method: 'post',
    data
  })
}
