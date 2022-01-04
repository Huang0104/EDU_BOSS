<template>
    <div class="app-header">
        <!-- 头部左侧 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 头部右侧 -->
        <el-dropdown>
            <span class="el-dropdown-link">
                <el-avatar
                    size="medium"
                    :src="userInfo.portrait || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'">
                </el-avatar>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
                <el-dropdown-item
                  divided
                  @click.native='handleLoginOut'
                >退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
// 引入用户信息接口功能
import { getUserInfo } from '@/services/user'
export default {
  name: 'AppHeader',
  //  created 挂载函数，在示例完成之后调用
  created () {
    //   加载用户信息功能
    this.loadUserInfo()
  },
  data () {
    return {
    //   存储用户信息
      userInfo: {}
    }
  },
  methods: {
    //   封装用户信息功能
    async loadUserInfo () {
      const { data } = await getUserInfo()
      this.userInfo = data.content
    },
    // 退出功能
    handleLoginOut () {
      // 消息提示
      this.$confirm('是否确定退出?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 1、清除 token 中的用户信息
        this.$store.commit('setUser', null)
        // 2、跳转至 login 页面
        this.$router.push('/login')
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .app-header {
        display: flex;
        align-items: center;
        height: 100%;
        justify-content: space-between;
    }
</style>
