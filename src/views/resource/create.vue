<template>
  <div class="create-resource">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        添加菜单
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="资源名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="资源路径">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="资源分类">
          <el-select v-model="form.categoryId" placeholder="全部">
          <!-- 选择分类 -->
            <el-option
              v-for="item in resourceClass"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 引入
import { getResourceInfo, CreateOrEditResource } from '@/services/resource'
export default {
  name: 'CreateResource',
  data () {
    return {
      form: {
        name: '',
        // 默认为第一个
        categoryId: 1,
        url: '',
        description: ''
      },
      // 存储分类资源数据
      resourceClass: []
    }
  },
  created () {
    this.loadResourceClass()
  },
  methods: {
    async onSubmit () {
      // 1.表单验证
      // 2.提交表单
      const { data } = await CreateOrEditResource(this.form)
      if (data.code === '000000') {
        this.$message.success('提交成功！')
        // 跳转回资源页面
        this.$router.push({
          name: 'resource'
        })
      }
    },
    async loadResourceClass () {
      const { data } = await getResourceInfo()
      if (data.code === '000000') {
        // 将分类信息存储到 resourceClass 中
        this.resourceClass = data.data
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
