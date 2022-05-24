import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/project/depQuery',
    method: 'post',
    params
  })
}

export function fetchAllDepartment(params) {
  return request({
    url: '/api/project/depAll',
    method: 'post',
    params
  })
}

export function createDepartment(data) {
  return request({
    url: '/api/project/depAdd',
    method: 'post',
    data
  })
}

export function updateDepartment(data) {
  return request({
    url: '/api/project/depAdd',
    method: 'post',
    data
  })
}

export function deleteDepartment(data) {
  return request({
    url: '/api/project/delDep',
    method: 'post',
    data
  })
}
