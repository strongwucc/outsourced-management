import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/api/needs/queryCat',
    method: 'post',
    params
  })
}

export function fetchAllCategory(params) {
  return request({
    url: '/api/needs/queryParentCat',
    method: 'post',
    params
  })
}

export function createCategory(data) {
  return request({
    url: '/api/needs/addCat',
    method: 'post',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: '/api/needs/addCat',
    method: 'post',
    data
  })
}

export function createCategoryProp(data) {
  return request({
    url: '/api/needs/addProperty',
    method: 'post',
    data
  })
}

export function updateCategoryProp(data) {
  return request({
    url: '/api/needs/addProperty',
    method: 'post',
    data
  })
}

export function deleteCategory(data) {
  return request({
    url: '/api/needs/delCat',
    method: 'post',
    data
  })
}
