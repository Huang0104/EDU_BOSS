<template>
    <div class="menu-edit">
        <!-- 设置 :is-edit 进行编辑功能的展示 -->
        <create-or-edit :is-edit="true"></create-or-edit>
    </div>
</template>

<script>
// 引入 createOrEdit 组件
import CreateOrEdit from './components/create-or-edit'
export default {
  name: 'MenuEdit',
  components: {
    CreateOrEdit
  }
}
</script>

<style lang="scss" scoped></style>
