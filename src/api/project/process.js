import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/vue-admin-template/project/process/list',
    method: 'post',
    params
  })
}

export function createProcess(data) {
  return request({
    url: '/vue-element-admin/project/process/create',
    method: 'post',
    data
  })
}

export function fetchDetail(data) {
  return request({
    url: '/vue-element-admin/project/process/detail',
    method: 'post',
    data
  })
}
