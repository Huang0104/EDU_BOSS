<template>
  <div class='course-list'>
    <el-card>
      <div slot="header">
          <span>数据筛选</span>
      </div>
      <el-form
        :inline="true"
        :model="filterParams"
        class="demo-form-inline">
        <el-form-item label="课程名称">
          <el-input v-model="filterParams.courseName" placeholder="课程名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterParams.status" placeholder="全部">
          <el-option label="上架" value="1"></el-option>
          <el-option label="下架" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button
            type="primary"
            @click="onSubmit"
            :disabled="isLoading">查询</el-button>
          <el-button
            type="primary"
            @click="onSubmit"
            :disabled="isLoading">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span>数据查询结果</span>
        <el-button
          style="float: right; margin-top: -10px"
          type="primary"
          @click="$router.push({
            name: 'course-create'
          })">添加课程</el-button>
      </div>
      <el-table
        :data="courses"
        style="width: 100%">
        <el-table-column
        prop="id"
        label="ID">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格">
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="排序">
        </el-table-column>
        <el-table-column
          prop="status"
          label="上架状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @change="onStatusChange(scope.row)"
              :disabled="scope.row.isStatusLoading">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="$router.push({
                name: 'course-edit',
                params: {
                  courseId: scope.row.id
                }
              })"
            >编辑</el-button>
            <el-button
              size="mini"
              @click="$router.push({
                name: 'course-section',
                params: {
                  courseId: scope.row.id
                }
              })"
            >内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :disabled="isLoading"
        :current-page="filterParams.currentPage"
        @current-change="handleCurrentChange"/>
    </el-card>
  </div>
</template>

<script>

import { getQueryCourses, statusChange } from '@/services/course'

export default {
  name: 'CourseList',
  data () {
    return {
      // 筛选功能参数
      filterParams: {
        currentPage: 1,
        pageSize: 10,
        courseName: '',
        status: ''
      },
      // 加载状态
      isLoading: false,
      // 课程信息
      courses: [],
      // 数据总条数
      totalCount: 0
    }
  },
  created () {
    // 加载课程
    this.loadCourse()
  },
  methods: {
    // 课程上下架处理
    async onStatusChange (course) {
      // 请求开始前，更改课程操作状态
      course.isStatusLoading = true
      const { data } = await statusChange({
        courseId: course.id,
        status: course.status
      })
      if (data.code === '000000') {
        this.$message.success(`已${course.status === 1 ? '上架' : '下架'}`)
        // 请求结束，更改课程操作状态
        course.isStatusLoading = false
      }
    },
    // 加载课程操作
    async loadCourse () {
      this.isLoading = true
      const { data } = await getQueryCourses(this.filterParams)
      if (data.code === '000000') {
        // 表示状态是否在切换中
        data.data.records.forEach(element => {
          element.isStatusLoading = false
        })
        // 存储课程信息
        this.courses = data.data.records
        this.totalCount = data.data.total
        this.isLoading = false
      }
    },
    // 查询操作
    onSubmit () {
      // 将当前页码重置为 1
      this.filterParams.currentPage = 1
      // 重新加载
      this.loadCourse()
    },
    // 页码改变操作
    handleCurrentChange (page) {
      this.filterParams.currentPage = page
      this.loadCourse()
    }
  }
}
</script>

<style lang="scss" scoped></style>
