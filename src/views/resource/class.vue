<template>
  <div class="resource-class">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button
          size="mini"
          @click = 'createResource'
        >添加</el-button>
        <el-dialog
          :title="isEdit ? '编辑菜单' : '添加菜单'"
          :visible.sync="dialogFormVisible">
          <!-- 引入组件 -->
          <create-or-edit
            @cancel="handleCancel"
            @success="handleSuccess"
            :is-edit="isEdit"
            :resource-id="resourceId"
          ></create-or-edit>
        </el-dialog>
      </div>
      <el-table
        :data="resourceClass"
        style="width: 100%"
        class="table">
        <el-table-column
          type="index"
          label="编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="180">
        </el-table-column>
        <!-- 时间操作使用过滤器 -->
        <el-table-column
          label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createdTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          width="180">
        </el-table-column>
        <!-- 操作使用 template 操作 -->
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              size='mini'
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size='mini'
              @click="handleDelete(scope.row)"
              type="danger"
              >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
// 引入
import { getResourceInfo, deleteResourceClass } from '@/services/resource'
import CreateOrEdit from './components/class-create-or-edit.vue'
export default {
  name: 'ResourceClass',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      // 储存分类信息
      resourceClass: [],
      dialogFormVisible: false,
      // 接收传过来的 ID
      resourceId: '',
      // 判断操作状态
      isEdit: false
    }
  },
  created () {
    this.loadClassInfo()
  },
  methods: {
    // 取消隐藏 提示框
    handleCancel () {
      this.dialogFormVisible = false
    },
    // 确定隐藏提示框
    handleSuccess () {
      this.dialogFormVisible = false
      // 更新当前分类信息
      this.loadClassInfo()
    },
    createResource () {
      this.dialogFormVisible = true
    },
    async loadClassInfo () {
      const { data } = await getResourceInfo()
      if (data.code === '000000') {
        this.resourceClass = data.data
      }
    },
    // 删除操作
    handleDelete (rowDate) {
      this.$confirm('确定删除吗?', '删除提示')
        .then(async () => {
        // 通过 id 删除
          const { data } = await deleteResourceClass(rowDate.id)
          if (data.code === '000000') {
            // 更新当前资源
            this.loadClassInfo()
            this.$message.success('删除成功!')
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    handleEdit (resource) {
      this.dialogFormVisible = true
      this.isEdit = true
      this.resourceId = resource.id
    }
  },
  // 添加过滤器
  filters: {
    dateFormat (date) {
      date = new Date(date)
      return `
        ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}
        ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
      `
    }
  }
}
</script>

<style lang="scss" scoped></style>
