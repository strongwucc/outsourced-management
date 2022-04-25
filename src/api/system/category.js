import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/vue-admin-template/system/category/list',
    method: 'post',
    params
  })
}

export function fetchAllCategory(params) {
  return request({
    url: '/vue-admin-template/system/category/all',
    method: 'post',
    params
  })
}

export function createCategory(data) {
  return request({
    url: '/vue-element-admin/system/category/create',
    method: 'post',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: '/vue-element-admin/system/category/update',
    method: 'post',
    data
  })
}

export function createCategoryProp(data) {
  return request({
    url: '/vue-element-admin/system/category/prop/create',
    method: 'post',
    data
  })
}

export function updateCategoryProp(data) {
  return request({
    url: '/vue-element-admin/system/category/prop/update',
    method: 'post',
    data
  })
}
