<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 使用 form 表单的行内表单 -->
        <el-form
          :inline="true"
          :model="role"
          class="demo-form-inline"
          ref="role">
          <el-form-item label="输入搜索" prop="name">
            <el-input v-model="role.name" placeholder="角色名称" clearable></el-input>
          </el-form-item>
          <el-form-item class="button">
            <el-button size="mini" @click="onReset">重置</el-button>
            <el-button type="primary" @click="onSubmit" size="mini" :disabled="isLoading">查询搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button
          size="mini"
          @click = 'handleCreate'
        >添加角色</el-button>
      <el-table
        :data="rolesInfo"
        style="width: 100%">
        <el-table-column
          type="index"
          label="编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column
          label="添加时间">
          <template slot-scope="scope">
          {{ scope.row.createdTime | dateFormat }}
        </template>
        </el-table-column>
        <el-table-column
          label="操作"
          class="role-button">
          <template slot-scope="scope">
          <el-button
            size="mini"
            @click="$router.push({
              name: 'alloc-menu',
              params: {
                roleId: scope.row.id
              }
            })"
          >分配菜单</el-button>
          <el-button
            size="mini"
          >分配资源</el-button>
          <el-button
            size="mini"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :title="isEdit ? '编辑角色' : '添加角色' "
        :visible.sync="dialogFormVisible">
        <!-- 引入封装好的组件 -->
        <create-or-edit
          :role-id="roleId"
          :is-edit="isEdit"
          @success="handleSuccess"
          @cancel="handleCancel"></create-or-edit>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import CreateOrEdit from './CreateOrEdit.vue'
import { getRolePages, deleteRole } from '@/services/role'
export default {
  name: 'RoleList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      role: {
        name: ''
      },
      // 正在编辑的角色 ID
      roleId: '',
      // 存储角色信息
      rolesInfo: [],
      // 判断加载状态
      isLoading: false,
      // 控制 dialog 是否显示
      dialogFormVisible: false,
      // 判断操作状态（添加还是编辑）
      isEdit: false
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    // 取消操作
    handleCancel () {
      this.dialogFormVisible = false
    },
    // 确定操作
    handleSuccess () {
      //  隐藏对话框
      this.dialogFormVisible = false
      // 刷新列表
      this.loadRoles()
    },
    async loadRoles () {
      const { data } = await getRolePages({})
      if (data.code === '000000') {
        this.rolesInfo = data.data.records
      }
    },
    // 添加角色操作
    handleCreate () {
      this.dialogFormVisible = true
      this.isEdit = false
    },
    // 重置操作
    onReset () {
      console.log('reset!')
    },
    // 查询操作
    onSubmit () {
      console.log('submit!')
    },
    // 编辑操作
    handleEdit (role) {
      this.dialogFormVisible = true
      this.isEdit = true
      this.roleId = role.id
    },
    // 删除操作
    handleDelete (role) {
      this.$confirm(`确定删除 ${role.name} ?`, '删除提示')
        .then(async () => {
          const { data } = await deleteRole(role.id)
          if (data.code === '000000') {
            this.$message.success('删除成功!')
            this.loadRoles()
          }
        })
        .catch(err => {
          if (err && err.respone) {
            this.$message.error('删除失败，请重试!')
          } else {
            this.$message.info('取消删除！')
          }
        })
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
    float: right
  }
  .cell .el-button {
    width: 60px;
    border: 0;
    color: #566B80;
  }
</style>
