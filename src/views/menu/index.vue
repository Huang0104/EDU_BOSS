<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-button
        @click = '$router.push({ name: "menu-create" })'
      >添加菜单</el-button>
    </div>
    <!-- 菜单列表展示区域 -->
    <!-- el-table元素中注入data对象数组 -->
    <el-table
      :data="menus"
      style="width: 100%">
      <!-- 在el-table-column中用prop属性来对应对象中的键名即可填入数据 -->
      <el-table-column
        type="index"
        label="编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="菜单名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="level"
        label="菜单级数">
      </el-table-column>
      <el-table-column
        prop="icon"
        label="前端图标">
      </el-table-column>
      <el-table-column
        prop="orderNum"
        label="排序">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>

// 引入 getALLMenu
import { getAllMenus, deleteMenu } from '@/services/menu'

export default {
  name: 'MenuIndex',
  data () {
    return {
      // 设置数据
      menus: []
    }
  },
  created () {
    // 加载所有菜单信息
    this.loadAllMenus()
  },
  methods: {
    async loadAllMenus () {
      const { data } = await getAllMenus()
      if (data.code === '000000') {
        this.menus = data.data
      }
    },
    handleEdit (rowData) {
      // 设置路由跳转
      this.$router.push({
        name: 'menu-edit',
        params: {
          id: rowData.id
        }
      })
    },
    handleDelete (rowData) {
      // 确定删除提示信息
      this.$confirm('确定删除当前信息吗？', '提示')
        .then(async () => {
          const { data } = await deleteMenu(rowData.id)
          if (data.code === '000000') {
            this.$message.success('删除成功!')
            // 更新菜单信息
            this.loadAllMenus()
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
