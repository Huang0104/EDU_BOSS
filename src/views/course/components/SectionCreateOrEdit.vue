<template>
  <div class='create-or-edit'>
    <el-form :model="section">
      <el-form-item
        label="课程名称"
        :label-width="formLabelWidth"
        required>
        <el-input v-model="section.courseName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
        label="章节名称"
        :label-width="formLabelWidth"
        required>
        <el-input v-model="section.sectionName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
        label="章节描述"
        :label-width="formLabelWidth">
        <el-input
          v-model="section.description"
          autocomplete="off"
          type="textarea"></el-input>
      </el-form-item>
      <el-form-item
        label="章节排序"
        :label-width="formLabelWidth">
        <el-input-number
          v-model="section.orderNum"
          controls-position="right"
        ></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { SaveOrEditSection } from '@/services/section'
export default {
  name: 'SectionCreateOrEdit',
  data () {
    return {
      // 控制 dialog 是否显示
      dialogTableVisible: false,
      section: {
        // id: 0,
        // courseId: '',
        courseName: '',
        sectionName: '',
        description: '',
        orderNum: 0
        // status: 0
      },
      formLabelWidth: '120px'
    }
  },
  // created () {
  //   // 添加章节信息
  //   this.loadSection()
  // },
  methods: {
    // 取消操作
    onCancel () {
      this.$emit('cancel')
      // 清除表单
      this.section = {}
    },
    async onSubmit () {
      const { data } = await SaveOrEditSection(this.section)
      if (data.code === '000000') {
        // 关闭提示框
        this.$emit('success')
        // 提示信息
        this.$message.success('添加章节成功')
        // 清除表单
        // this.section = {}
      }
      this.dialogFormVisible = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
