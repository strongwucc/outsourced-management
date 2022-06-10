import request from '@/utils/request'

export function downloadFile(params) {
  return request({
    url: '/api/tools/downloadFile',
    method: 'get',
    params,
    responseType: 'arraybuffer'
  })
}
