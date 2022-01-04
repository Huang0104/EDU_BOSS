<template>
  <div class='alloc-menu'>
    <!-- 这是角色 ID 为 {{ $route.params.roleId }} 的菜单，不建议使用，因为需要搭配动态路由使用，独立的组件 -->
    <!-- 这是角色 ID 为 {{ roleId }} 的菜单 -->
    <el-card>
      <el-tree
      ref="role-menu"
      node-key="id"
      :data="menus"
      :props="defaultProps"
      :default-checked-keys="checkedKeys"
      default-expand-all
      show-checkbox></el-tree>
      <div style="margin: 20px;">
        <el-button
         type="primary"
         size="mini"
         @click="onSave">保存</el-button>
        <el-button size="mini" @click="onReset">清空</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getMenuNodeList, allocateRoleMenu, getRoleMenus } from '@/services/menu'
export default {
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      // 存储勾选的 ID
      checkedKeys: []
    }
  },
  created () {
    // 获取所有菜单列表
    this.loadMenuNodeList()
    // 获取角色拥有的菜单列表
    this.loadRoleMenus()
  },
  methods: {
    // 清空
    onReset () {
      this.$refs['role-menu'].setCheckedKeys([])
    },
    // 自己封装数据筛选功能
    getCheckedKeys (menus) {
      // 遍历数组（排除所有存在子节点的 node, 筛选子节点列表）
      menus.forEach(menu => {
        // 未选中，结束
        if (!menu.selected) {
          return
        }
        // 选中，判断当前节点是否存在子节点
        if (menu.subMenuList) {
          // 对子节点进行检测，结束
          return this.getCheckedKeys(menu.subMenuList)
        }
        // 叶子节点，即不存在子节点的节点，存储 ID
        // this.checkedKeys.push(menu.id) //异步操作，9数据更新多次，视图未更新
        this.checkedKeys = [...this.checkedKeys, menu.id]
      })
    },
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      if (data.code === '000000') {
        this.getCheckedKeys(data.data)
      }
    },
    async onSave () {
      const { data } = await allocateRoleMenu({
        roleId: this.roleId,
        menuIdList: this.$refs['role-menu'].getCheckedKeys()
      })
      if (data.code === '000000') {
        this.$message.success('分配菜单成功')
        this.$router.push({
          name: 'role'
        })
      }
    },
    async loadMenuNodeList () {
      const { data } = await getMenuNodeList()
      if (data.code === '000000') {
        this.menus = data.data
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
