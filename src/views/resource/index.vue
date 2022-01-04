<template>
    <div class="resource">
      <!-- 引入资源列表组件 -->
      <resource-list></resource-list>
    </div>
</template>

<script>
// 引入
import ResourceList from './components/list.vue'
export default {
  name: 'ResourceIndex',
  // 设置为组件
  components: {
    ResourceList
  }
}
</script>

<style lang="scss" scoped></style>
