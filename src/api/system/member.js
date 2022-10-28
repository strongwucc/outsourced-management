import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/setting/userList',
    method: 'post',
    params
  })
}

export function fetchAllMember(params) {
  return request({
    url: '/api/setting/userAll',
    method: 'post',
    params
  })
}

export function createMember(data) {
  return request({
    url: '/api/setting/userAdd',
    method: 'post',
    data
  })
}

export function updateMember(data) {
  return request({
    url: '/api/setting/userEdit',
    method: 'post',
    data
  })
}

export function deleteMember(data) {
  return request({
    url: '/api/setting/userDel',
    method: 'post',
    data
  })
}

export function updateSelfData(data) {
  return request({
    url: '/api/setting/userSelfEdit',
    method: 'post',
    data
  })
}
