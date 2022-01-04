import request from '@/utils/request'

// 获取章节和课程信息
export const getSectionAndLesson = courseId => {
  return request({
    method: 'GET',
    url: '/boss/course/section/getSectionAndLesson',
    params: {
      courseId
    }
  })
}

// 新增或者更新章节信息
export const SaveOrEditSection = data => {
  return request({
    method: 'POST',
    url: '/boss/course/section/saveOrUpdateSection',
    data
  })
}

// 新增或更新课时信息
export const SaveOrEditLesson = data => {
  return request({
    method: 'POST',
    url: '/boss/course/lesson/saveOrUpdate',
    data
  })
}

// 通过 sectionId 获取数据
export const getSectionById = sectionId => {
  return request({
    method: 'GET',
    url: '/boss/course/section/getBySectionId',
    params: [
      sectionId
    ]
  })
}
