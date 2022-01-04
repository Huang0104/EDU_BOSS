<template>
  <div class="create-or-edit">
    <el-form :model="form">
      <el-form-item
        label="名称:"
        :label-width="formLabelWidth"
        porp="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="排序:" :label-width="formLabelWidth">
        <el-input v-model="form.sort" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { getResourceClass } from '@/services/resource'
export default {
  name: 'CreateOrEdit',
  // 接收父组件 通过 porps 传值，判断是添加还是编辑
  porps: {
    isEdit: {
      type: Boolean,
      // 默认是 false
      default: false
    },
    resourceId: {
      type: [Number, String]
    }
  },
  data () {
    return {
      form: {
        name: '',
        sort: 0
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    // 取消状态，让父组件处理
    onCancel () {
      // 关闭提示框
      this.$emit('cancel')
      // 清空提示框
      this.form = {}
    },
    async onSubmit () {
      const { data } = await getResourceClass(this.form)
      if (data.code === '000000') {
        this.$message.success('添加成功！')
        // 清除表单
        this.form = {}
        // 关闭提示框
        this.$emit('success')
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
