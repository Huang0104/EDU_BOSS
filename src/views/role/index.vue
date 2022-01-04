<template>
    <div class="role">
      <!-- 引入列表组件 -->
      <role-list></role-list>
    </div>
</template>

<script>
// 引入组件
import RoleList from './components/list.vue'
export default {
  name: 'RoleIndex',
  // 注册子组件
  components: {
    RoleList
  }
}
</script>

<style lang="scss" scoped></style>
