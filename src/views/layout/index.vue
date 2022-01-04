<template>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- 侧边栏组件 -->
        <app-aside></app-aside>
      </el-aside>
      <el-container>
        <!-- 头部 -->
        <el-header>
          <!-- 头部组件 -->
          <app-header></app-header>
        </el-header>
        <!-- 主体 -->
        <el-main>
          <!-- 子路由出口 -->
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
// 引入小功能组件
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'

export default {
  name: 'Layout',
  components: {
    AppAside,
    AppHeader
  }
}
</script>

<style lang="scss" scoped>
  .el-container {
    height: 100vh;
  }
  .el-header {
    background-color: #fff;
  }
</style>
