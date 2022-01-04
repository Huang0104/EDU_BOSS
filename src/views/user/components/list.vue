<template>
  <el-card>
    <div class='user-list' slot="header">
      <el-form
        ref="filter-form"
        :inline="true"
        :model="filterParams"
        class="demo-form-inline">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="filterParams.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="注册时间" prop="rangeDate">
          <el-date-picker
            v-model="filterParams.rangeDate"
            type="datetimerange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            size="mini"
            type="primary"
            @click="onSubmit"
            :disabled="isLoading">查询</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="onReset"
            :disabled="isLoading">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="users"
      style="width: 100%"
      v-loading="isLoading">
      <el-table-column
        prop="id"
        label="用户 ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="头像"
        width="180">
        <template slot-scope="scope">
          <el-avatar :src="scope.row.portrait || 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="注册时间">
      </el-table-column>
      <el-table-column
        prop="name"
        label="状态"
        width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="ENABLE"
            inactive-value="DISABLE"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleForbidUser(scope.row)"
            >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleSelectRole(scope.row)">
          分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 设置 dialog 对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="dialogVisible"
      width="30%">
      <!-- 设置下拉菜单 -->
      <el-select v-model="roleIdList" multiple placeholder="请选择角色">
        <el-option
          v-for="item in roles"
          :key="item.value"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="handleAllocRoles">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { getUserPages, forbidUser } from '@/services/user'
import { getRoleAlls, allocUserRoles, getUserId } from '@/services/role'
export default {
  name: 'UserList',
  data () {
    return {
      users: [],
      filterParams: {
        currentPage: 1,
        pageSize: 100,
        phone: '',
        rangeDate: [],
        stateCreateTime: '',
        endCreateTime: ''
      },
      // 选项数据,所有角色
      roles: [],
      // 存储选中的数据,选中角色
      roleIdList: [],
      isLoading: false,
      // 设置 dialogVisible
      dialogVisible: false,
      // 存储当前分配角色用户的 ID
      currentUserId: null
    }
  },
  created () {
    // 获取用户信息
    this.loadUsers()
  },
  methods: {
    // 提交分配角色
    async handleAllocRoles () {
      // 点击确定，提交给服务端
      const { data } = await allocUserRoles({
        userId: this.currentUserId,
        roleIdList: this.roleIdList
      })
      if (data.code === '000000') {
        // 提示成功
        this.$message.success('分配成功')
        // 关闭弹窗
        this.dialogVisible = false
      }
    },
    // 加载用户
    async loadUsers () {
      this.isLoading = true
      const { rangeDate } = this.filterParams
      if (rangeDate && rangeDate.length) {
        this.filterParams.stateCreateTime = rangeDate[0]
        this.filterParams.endCreateTime = rangeDate[1]
      } else {
        this.filterParams.stateCreateTime = ''
        this.filterParams.endCreateTime = ''
      }
      const { data } = await getUserPages(this.filterParams)
      if (data.code === '000000') {
        this.users = data.data.records
        this.isLoading = false
      }
    },
    onSubmit () {
      this.filterParams.currentPage = 1
      this.loadUsers()
    },
    onReset () {
      this.$refs['filter-form'].resetFields()
      this.loadUsers()
    },
    async handleForbidUser (user) {
      const { data } = await forbidUser(user.id)
      console.log(data)
    },
    // 分配角色
    async handleSelectRole (userInfo) {
      this.currentUserId = userInfo.id
      this.dialogVisible = true
      // 获取角色
      const { data } = await getRoleAlls()
      if (data.code === '000000') {
        this.roles = data.data
      }
      // 查询用户角色
      const { data: data2 } = await getUserId(userInfo.id)
      console.log(data2)
      if (data2.code === '000000') {
        this.roleIdList = data2.data.map(item => item.id)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
