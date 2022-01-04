<template>
  <div class="resource-list">
    <!-- 使用 card 组件 -->
    <el-card class="box-card">
      <div solt="header" class="clearfix">
        <!-- 使用 form 表单的行内表单 -->
        <el-form
          :inline="true"
          :model="form"
          class="demo-form-inline"
          ref="form">
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="form.name" placeholder="资源名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="资源路径" prop="url">
          <el-input v-model="form.url" placeholder="资源路径" clearable></el-input>
        </el-form-item>
        <el-form-item class="button">
          <el-button size="mini" @click="onReset">重置</el-button>
          <el-button type="primary" @click="onSubmit" size="mini" :disabled="isLoading">查询搜索</el-button>
        </el-form-item>
        <el-form-item label="资源分类" prop="categoryId">
          <el-select v-model="form.categroyId" placeholder="资源分类" clearable>
            <!-- 设置下拉资源分类信息 -->
            <el-option
              v-for="item in resourceClassInfo"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        </el-form>
      </div>
      <div class="add">
        <el-button
            size="mini"
            @click = '$router.push({ name: "resource-create" })'
        >添加</el-button>
        <el-button
            size="mini"
            @click = '$router.push({ name: "resource-class" })'
        >资源分类</el-button>
      </div>
      <!-- 使用 table 组件 -->
      <el-table
      :data="resources"
      style="width: 100%"
      v-loading="isLoading">
      <el-table-column
        type="index"
        label="编号">
      </el-table-column>
      <el-table-column
        prop="name"
        label="资源名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="url"
        label="资源路径"
        width="180">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述">
      </el-table-column>
      <!-- 时间通过过滤器处理
      table 组件数据使用过滤器处理
      自定义模板设置插值表达式 -->
      <el-table-column
        label="添加时间">
        <template slot-scope="scope">
          {{ scope.row.createdTime | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.current"
        :page-sizes="[10, 15, 20]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="isLoading">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
// 引入接口请求文件
import { getResourcePages, deleteResource, getResourceInfo } from '@/services/resource'
export default {
  name: 'ResourceList',
  data () {
    return {
      form: {
        // 当前页
        current: 1,
        // 每页显示的条数
        size: 10,
        // 资源名称
        name: '',
        // 资源路径
        url: '',
        // 资源分类 ID
        categroyId: ''
      },
      // 总条数
      totalCount: 0,
      // 存储资源信息
      resources: [],
      // 存储分类资源信息
      resourceClassInfo: [],
      // 加载状态
      isLoading: false
    }
  },
  // 通过 created 钩子获取请求的资源
  created () {
    // 获取所有资源
    this.loadResources()
    // 获取分类资源信息
    this.loadResourceClass()
  },
  methods: {
    // 重置操作
    onReset () {
      this.$refs.form.resetFields()
    },
    // 查询操作
    onSubmit () {
      this.form.current = 1
      this.loadResources()
    },
    // 分类信息
    async loadResourceClass () {
      const { data } = await getResourceInfo()
      if (data.code === '000000') {
        this.resourceClassInfo = data.data
      }
    },
    // 通过分页获取资源信息
    async loadResources () {
      // 开始为加载状态
      this.isLoading = true
      //  请求时，如果没参数就传入空对象，否则参数不完整导致出错
      const { data } = await getResourcePages(this.form)
      if (data.code === '000000') {
        this.resources = data.data.records
        this.totalCount = data.data.total
        // 请求结束为不加载状态
        this.isLoading = false
      }
    },
    // 编辑操作
    handleEdit (rowDate) {
      this.$router.push({
        name: 'resource-edit',
        params: {
          id: rowDate.id
        }
      })
    },
    // 删除操作
    handleDelete (rowDate) {
      this.$confirm('确定删除吗?', '删除提示')
        .then(async () => {
          // 通过 id 删除
          const { data } = await deleteResource(rowDate.id)
          if (data.code === '000000') {
            // 更新当前资源
            this.loadResources()
            this.$message.success('删除成功!')
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    // 分页操作
    // 每页显示条数变化时触发
    handleSizeChange (val) {
      this.form.size = val
      // 修改每页的条数，需要将页码还原成默认值 1
      this.form.current = 1
      // 重新更新资源
      this.loadResources()
    },
    // 页号改变时触发
    handleCurrentChange (val) {
      this.form.current = val
      // 重新更新资源
      this.loadResources()
    }
  },
  filters: {
    dateFormat (date) {
      date = new Date(date)
      return `
        ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}
        ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }
  }
}
</script>

<style lang="scss" scoped>
  .button {
    float: right;
  }
  .clearfix, .add{
      border-bottom: 2px solid #E8EDF2;
  }
  .add {
      height: 60px;
      line-height: 60px;
  }
</style>
