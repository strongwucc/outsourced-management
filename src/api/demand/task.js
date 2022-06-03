import request from '@/utils/request'

export function fetchTaskDetail(data) {
  return request({
    url: '/api/needs/taskDetail',
    method: 'post',
    data
  })
}

export function createTask(data) {
  return request({
    url: '/api/needs/addTask',
    method: 'post',
    data
  })
}

export function updateTask(data) {
  return request({
    url: '/api/needs/addTask',
    method: 'post',
    data
  })
}
