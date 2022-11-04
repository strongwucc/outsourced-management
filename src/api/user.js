import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/auth/me',
    method: 'post'
  })
}

export function getPending() {
  return request({
    url: '/api/auth/pending',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  })
}

export function checkCode(data) {
  return request({
    url: '/api/auth/checkCode',
    method: 'post',
    data
  })
}
