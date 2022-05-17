import request from '@/utils/request'

export function fetchTaskDetail(data) {
  return request({
    url: '/vue-admin-template/demand/task/detail',
    method: 'post',
    data
  })
}

export function createTask(data) {
  return request({
    url: '/vue-element-admin/demand/task/create',
    method: 'post',
    data
  })
}

export function updateTask(data) {
  return request({
    url: '/vue-element-admin/demand/task/update',
    method: 'post',
    data
  })
}
