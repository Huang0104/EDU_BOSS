<template>
  <div class='create-image'>
    <el-form-item :label="label">
      <!-- 进度条组件 -->
      <el-progress
        type="circle"
        :percentage="percentage"
        :width="178"
        v-if="isProgressLoading"
        :status="percentage === 100 ? 'success' : undefined"
      ></el-progress>
      <!-- 图片上传组件 -->
      <el-upload
        v-else
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :http-request="handleUpload">
        <!-- 显示预览图片元素 -->
        <img v-if="value" :src="value" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
  </div>
</template>

<script>
import { uploadCourseImage } from '@/services/course'

export default {
  name: 'CreateImage',
  // 接收父组件传过来的值
  props: {
    value: {
      type: String
    },
    label: {
      type: String
    },
    limit: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      // 图片上传状态控制
      isProgressLoading: false,
      // 保存进度条上传进度百分比
      percentage: 0
    }
  },
  methods: {
    // 自定义课程封面上传
    // option 为上传相关信息
    // option file 为要上传文件的信息
    async handleUpload (options) {
      // 正在上传
      this.isProgressLoading = true
      // 创建 FormData 对象
      const fd = new FormData()
      // 将需要的数据添加到 FormData 对象中
      fd.append('file', options.file)
      // 调用接口进行图片上传
      const { data } = await uploadCourseImage(fd, event => {
        this.percentage = Math.floor(event.loaded / event.total * 100)
      })
      if (data.code === '000000') {
        this.$emit('input', data.data.name)
        // 上传成功
        this.isProgressLoading = false
        // 上传成功后，设置进度条信息为 0 ，避免回退问题
        this.percentage = 0
      }
    },
    // 文件上传成功
    handleAvatarSuccess (res, file) {
      // 保存预览图片地址
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 文件上传之前
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < this.limit

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error(`上传头像图片大小不能超过 ${this.limit} MB`)
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
