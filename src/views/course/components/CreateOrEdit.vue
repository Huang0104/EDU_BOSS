<template>
  <div class='create-or-edit'>
    <el-card>
      <!-- 步骤条区域 -->
      <div slot="header">
        <el-steps :active="activeStep" simple>
          <el-step
            v-for="(item, i) in steps"
            :key="item.id"
            :title="item.title"
            :icon="item.icon"
            @click.native="activeStep = i"></el-step>
        </el-steps>
      </div>
      <!-- 步骤条对应的 form 表单 -->
      <el-form label-width="80px">
        <!-- 基本信息 -->
        <div v-show="activeStep === 0">
          <span>基本信息</span>
          <el-form-item label="课程名称" required>
            <el-input v-model="course.courseName" maxlength="50" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="课程简介" required>
            <el-input v-model="course.brief" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="课程概述" required>
            <el-input
              v-model="course.previewFirstField"
              maxlength="20"
              show-word-limit
              style="width: 49%; margin-right: 5px"></el-input>
            <el-input
              v-model="course.previewSecondField"
              maxlength="20"
              show-word-limit
              style="width: 49%"></el-input>
          </el-form-item>
          <el-form-item label="课程排序" required>
            <el-input-number controls-position="right" v-model="course.sortNum"></el-input-number>
          </el-form-item>
          <el-form-item label="讲师姓名" required>
            <el-input
              v-model="course.teacherDTO.teacherName"
              maxlength="50"
              show-word-limit
              ></el-input>
          </el-form-item>
          <el-form-item label="讲师职位" required>
            <el-input
              v-model="course.teacherDTO.position"
              maxlength="50"
              show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="讲师简介" required>
            <el-input
              v-model="course.teacherDTO.description"
              maxlength="100"
              show-word-limit></el-input>
          </el-form-item>
        </div>
        <!-- 课程封面 -->
        <div v-show="activeStep === 1">
          <!-- 封装为组件 -->
          <!-- 课程封面 -->
          <create-image
            v-model="course.courseListImg"
            label="课程封面"
          ></create-image>
          <!-- 解锁封面 -->
          <create-image
            v-model="course.courseImgUrl"
            label="解锁封面"
            :limit="4"
          ></create-image>
        </div>
        <!-- 销售信息 -->
        <div v-show="activeStep === 2">
          <span>销售信息</span>
          <el-form-item label="售卖价格" required>
            <el-input
              v-model="course.discounts"
              type="Number"
              :min="0"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input
              v-model="course.price"
              type="Number"
              :min="0"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input
              v-model="course.sales"
              type="Number"
              :min="0"
            >
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input
              v-model="course.discountsTag"
              maxlength="4"
              show-word-limit>
            </el-input>
          </el-form-item>
        </div>
        <!-- 秒杀活动 -->
        <div v-show="activeStep === 3">
          <span>秒杀活动</span>
          <el-form-item label="限时秒杀开关" label-width="120px">
            <!-- 限时秒杀开关 -->
            <el-switch
              v-model="course.activityCourse"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <!-- 限时秒杀开时展示的组件 -->
          <template v-if="course.activityCourse">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="course.activityCourseDTO.beginTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
              v-model="course.activityCourseDTO.endTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input
                v-model="course.activityCourseDTO.amount"
                type="Number"
                :min="0"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="秒杀库存">
              <el-input
                v-model="course.activityCourseDTO.stock"
                type="Number"
                :min="0"
              >
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>
        </div>
        <!-- 课程详情 -->
        <div v-show="activeStep === 4">
          <el-form-item label="课程详情">
            <text-editor v-model="course.courseDescriptionMarkDown"></text-editor>
          </el-form-item>
          <el-form-item label="是否上架">
            <el-switch
              v-model="course.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </el-form-item>
          <!-- 最后一步时，设置保存按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              @click="onSave"
            >
              保存
            </el-button>
          </el-form-item>
        </div>
        <!-- 设置下一步按钮 -->
        <el-form-item v-if="activeStep !== steps.length - 1">
          <el-button @click="activeStep++">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import CreateImage from './createImage.vue'
import { savaOrUpdateCourse, getCourseById } from '@/services/course'
import TextEditor from '@/components/textEditor'
export default {
  name: 'CreateOrEdit',
  components: {
    CreateImage,
    TextEditor
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [Number, String]
    }
  },
  data () {
    return {
      // 步骤条初始状态
      activeStep: 0,
      // 步骤条列表
      steps: [
        { id: 1, title: '基本信息', icon: 'el-icon-edit' },
        { id: 2, title: '课程封面', icon: 'el-icon-edit' },
        { id: 3, title: '销售信息', icon: 'el-icon-edit' },
        { id: 4, title: '秒杀活动', icon: 'el-icon-edit' },
        { id: 5, title: '课程详情', icon: 'el-icon-edit' }
      ],
      // 文件预览地址
      imageUrl: '',
      // 添加课程基本信息
      course: {
        // id: 0,
        // 课程名称
        courseName: '',
        // 课程简介
        brief: '',
        teacherDTO: {
          // id: 0,
          // courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        // 课程详情
        courseDescriptionMarkDown: '',
        // 课程原价
        price: 0,
        // 优惠价
        discounts: 0,
        // 原价标签
        priceTag: '',
        // 优惠标签
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        // 课程封面
        courseListImg: '',
        // 解锁封面
        courseImgUrl: '',
        // 排序
        sortNum: 0,
        // 概述1
        previewFirstField: '',
        // 概述2
        previewSecondField: '',
        // 课程状态
        status: 0,
        // 课程销量
        sales: 0,
        // 参与秒杀价的课程
        activityCourse: false,
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          // 开始时间
          beginTime: '',
          // 结束时间
          endTime: '',
          // 秒杀价
          amount: 0,
          // 库存
          stock: 0
        },
        autoOnlineTime: ''
      }
    }
  },
  // 判断当前状态是否为编辑状态，如果是，通过 ID 获取课程信息
  created () {
    if (this.isEdit) {
      this.loadCourse()
    }
  },
  methods: {
    // 根据课程 ID 获取课程信息
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      if (data.code === '000000') {
        // 为⾮秒杀课程初始化属性
        if (!data.data.activityCourse) {
          data.data.activityCourseDTO = {
            // id: 0,
            // courseId: 0,
            // 开始时间
            beginTime: '',
            // 结束时间
            endTime: '',
            // 秒杀价
            amount: 0,
            // 库存
            stock: 0
          }
        }
        this.course = data.data
      }
    },
    // 保存功能
    async onSave () {
      const { data } = await savaOrUpdateCourse(this.course)
      if (data.code === '000000') {
        this.$message.success(`${this.isEdit ? '编辑' : '添加'}课程成功`)
        this.$router.push({
          name: 'course'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-step {
   cursor: pointer;
 }
</style>
