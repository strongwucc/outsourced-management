import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/setting/emailList',
    method: 'post',
    params
  })
}

export function createEmail(data) {
  return request({
    url: '/api/setting/addEmail',
    method: 'post',
    data
  })
}

export function updateEmail(data) {
  return request({
    url: '/api/setting/addEmail',
    method: 'post',
    data
  })
}

export function deleteEmail(data) {
  return request({
    url: '/api/setting/delEmail',
    method: 'post',
    data
  })
}
