<template>
  <div class='text-editor'>
    <template>
       <div ref="editor"></div>
    </template>
  </div>
</template>

<script>
import E from 'wangeditor'
import { uploadCourseImage } from '@/services/course'
export default {
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      defalut: ''
    }
  },
  data () {
    return {
      editor: null,
      // 要编辑的数据是否加载完成
      isLoaded: false
    }
  },
  // 需要进行 DOM 操作，使用 mounted 钩子
  mounted () {
    // 调用函数，初始化富文本编辑器
    this.initEditor()
  },
  // 监听
  watch: {
    value () {
      // 编辑的新数据加载成功后，为富文本编辑器初始化内容即可
      if (!this.isLoaded) {
        this.editor.txt.html(this.value)
      }
    }
  },
  methods: {
    // 富文本编辑器操作
    initEditor () {
      // 创建富文本编辑器实例
      const editor = new E(this.$refs.editor)
      // 设置回调函数,必须在元素挂载完成之前
      //   普通函数注意 this 的指向，建议使用箭头函数
      editor.config.onchange = value => {
        this.$emit('input', value)
      }
      // 自定义上传图片功能
      // resultFiles 是 input 中选中的文件列表
      // insertImgFn 是获取图片 url 后，插入到编辑器的方法
      editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        // 调用上传图片接口
        const { data } = await uploadCourseImage(fd)
        if (data.code === '000000') {
          // 上传图片，返回结果，将图片插入到编辑器中
          insertImgFn(data.data.name)
        }
      }
      // 初始化富文本编辑器
      editor.create()
      // 设置编辑器内容(获取编辑器书写的内容)
      editor.txt.html(this.value)
      // 将富文本编辑器保存给 this ,方便 watch 操作
      this.editor = editor
    }
  }
}
</script>

<style lang="scss" scoped></style>
