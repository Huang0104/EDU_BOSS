// 引入 request
import request from '@/utils/request'

// 按条件分页查询资源请求
export const getResourcePages = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}

// 添加资源请求
export const CreateOrEditResource = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/saveOrUpdate',
    data
  })
}

// 查询资源信息(分类接口)
export const getResourceInfo = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}

// 添加分类资源
export const getResourceClass = data => {
  return request({
    method: 'POST',
    url: '/boss/resource/category/saveOrderUpdate',
    data
  })
}

// 删除资源
export const deleteResource = (id) => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/${id}`
  })
}

// 删除分类资源
export const deleteResourceClass = (id) => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/category/${id}`
  })
}

// 获取资源
export const getResourceById = (id) => {
  return request({
    method: 'GET',
    url: `/boss/resource/${id}`
  })
}
