<template>
  <div class='course-section'>
    <el-card>
      <div slot="header">
        <span>课程名称</span>
        <el-button
          type='primary'
          style="float: right; margin-top: -10px"
          @click="handleCreate"
        >添加阶段</el-button>
      </div>
      <el-tree
        v-loading="isLoading"
        :data="sections"
        :props="defaultProps"
        default-expand-all
        draggable
        :allow-drop="handleAllowDrop"
        @node-drop="handleNodeDrop"
      >
        <!-- 通过插槽接收组件暴露的数据 -->
        <div class="inner" slot-scope="{ node, data }">
          <!-- 设置内容，下面绑定的 label -->
          <span>{{ node.label }}</span>
          <!-- 通过 v-if 判断是章节还是课时 -->
          <!-- 章节 -->
          <span v-if="data.sectionName" class="actions">
            <el-button size="mini" @click="handleCreate">编辑</el-button>
            <el-button size="mini" type="primary">添加课时</el-button>
            <el-button size="mini">状态</el-button>
          </span>
          <!-- 课时 -->
          <span v-else class="actions">
            <el-button size="mini">编辑</el-button>
            <el-button
              size="mini"
              style="background-color: #48BC66; color: #fff"
              @click="$router.push({
                name: 'course-video',
                params: {
                  courseId
                },
                query: {
                  lessonId: data.id
                }
              })"
            >上传视频</el-button>
            <el-button size="mini">状态</el-button>
          </span>
        </div>
      </el-tree>
      <!-- dialog 组件 -->
      <el-dialog
        title="章节信息"
        :visible.sync="dialogFormVisible"
      >
        <!-- 引入组件 -->
        <create-or-edit
          @success="handleSave"
          @cancel="handleCancel"
        ></create-or-edit>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getSectionAndLesson, SaveOrEditLesson, SaveOrEditSection } from '@/services/section'
import CreateOrEdit from './components/SectionCreateOrEdit.vue'
export default {
  name: 'CourseSection',
  components: {
    CreateOrEdit
  },
  props: {
    courseId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      // 存储章节信息
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data) {
          return data.sectionName || data.theme
        }
      },
      // 控制 dialog 是否显示
      dialogFormVisible: false,
      isLoading: false
    }
  },
  created () {
    this.loadSection()
  },
  methods: {
    // 拖拽完成后的处理函数
    async handleNodeDrop (draggingNode, dropNode, type, event) {
      this.isLoading = true
      try {
        // Promise.all 将接收的数组数据批量发送异步请求
        await Promise.all(dropNode.parent.childNodes.map((item, index) => {
          // 判断是章节还是课时
          if (!draggingNode.data.sectionId) {
            return SaveOrEditSection({
              id: item.data.id,
              orderNum: index
            })
          } else {
            return SaveOrEditLesson({
              id: item.data.id,
              orderNum: index
            })
          }
        }))
        this.$message.success('数据更新成功')
      } catch (error) {
        this.$message.error('数据更新失败', error)
      }
      this.isLoading = false
    },
    // 拖拽节点处理函数
    handleAllowDrop (draggingNode, dropNode, type) {
      // 规则1：只能同级操作，即 type 不能为 inner
      // 规则2：课时不能拖拽到其他章节
      return type !== 'inner' && draggingNode.data.sectionId === dropNode.data.sectionId
    },
    // 取消操作
    handleCancel () {
      this.dialogFormVisible = false
    },
    handleSave () {
      this.dialogFormVisible = false
      // 刷新表单
      this.loadSection()
    },
    // 添加操作，点击按钮弹出提示框
    handleCreate () {
      this.dialogFormVisible = true
    },
    // 获取课程信息
    async loadSection () {
      const { data } = await getSectionAndLesson(this.courseId)
      if (data.code === '000000') {
        this.sections = data.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.inner {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid #ebeef5;
}
::v-deep .el-tree-node__content {
  height: auto;
}
</style>
