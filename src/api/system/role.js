import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/setting/groupList',
    method: 'post',
    params
  })
}

export function fetchAllRole(params) {
  return request({
    url: '/api/setting/groupList',
    method: 'post',
    params
  })
}

export function updateRole(data) {
  return request({
    url: '/api/setting/editGroup',
    method: 'post',
    data
  })
}
