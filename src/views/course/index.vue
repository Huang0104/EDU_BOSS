<template>
    <div class="course">
      <!-- 引入课程列表组件 -->
      <course-list></course-list>
    </div>
</template>

<script>
import CourseList from './components/list.vue'
export default {
  name: 'CourseIndex',
  components: {
    CourseList
  }
}
</script>

<style lang="scss" scoped></style>
