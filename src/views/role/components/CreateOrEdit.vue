<template>
  <div class="create-or-edit">
    <el-form :model="role">
      <el-form-item
        label="角色名称:"
        :label-width="formLabelWidth">
        <el-input v-model="role.name"></el-input>
      </el-form-item>
      <el-form-item label="角色编码" :label-width="formLabelWidth">
        <el-input v-model="role.code"></el-input>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input v-model="role.description" type="textarea"></el-input>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
  </div>
</template>

<script>
import { createRole, getRoleById } from '@/services/role'
export default {
  name: 'CreateOrEdeit',
  //  接受父组件传值，判断是添加还是编辑
  props: {
    isEdit: {
      type: Boolean,
      // 默认是添加
      default: false
    },
    roleId: {
      type: [Number, String]
    }
  },
  data () {
    return {
      role: {
        code: '',
        name: '',
        description: ''
      },
      formLabelWidth: '80px'
    }
  },
  created () {
    if (this.isEdit) {
      this.loadRoleById()
    }
  },
  methods: {
    async loadRoleById () {
      const { data } = await getRoleById(this.roleId)
      if (data.code === '000000') {
        this.role = data.data
      }
    },
    // 取消
    onCancel () {
      // 设置取消状态,让父组件处理
      this.$emit('cancel')
      this.role = {}
    },
    // 确定
    async onSubmit () {
      const { data } = await createRole(this.role)
      if (data.code === '000000') {
        // 关闭提示框，需要子组件想父组件传递状态
        this.$emit('success')
        // 提示
        this.$message.success('添加成功!')
        // 清除表单内容
        this.role = {}
      }
      this.dialogFormVisible = false
    }
  }
}
</script>

<style lang="scss" scoped></style>>
