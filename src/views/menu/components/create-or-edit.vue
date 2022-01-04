<template>
    <div class="create-or-edit">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>{{ isEdit ? '编辑菜单' : '添加菜单' }}</span>
            </div>
            <el-form
                ref="form"
                :model="form"
                label-width="80px"
                :rules="rules"
                >
                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="菜单路径">
                    <el-input v-model="form.href"></el-input>
                </el-form-item>
                <el-form-item label="上级菜单">
                    <el-select v-model="form.parentId" placeholder="请选择上级菜单">
                    <!-- 无上级菜单 -->
                    <el-option
                      label="无上级菜单"
                      :value="-1"
                    ></el-option>
                    <!-- 选择一级菜单 -->
                    <el-option
                      v-for="item in parentMenuList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="form.description"></el-input>
                </el-form-item>
                <el-form-item label="前端图标" prop="icon">
                    <el-input v-model="form.icon"></el-input>
                </el-form-item>
                <el-form-item label="是否显示">
                    <el-radio-group v-model="form.shown">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="form.orderNum"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <el-button v-if='!isEdit'>重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
// 引入 services 的 menu 文件
import { getEditMenuInfo, CreateOrUpdateMenu } from '@/services/menu'

export default {
  name: 'CreateOrEdit',
  //  接受父组件传值，判断是添加还是编辑
  props: {
    isEdit: {
      type: Boolean,
      // 默认是添加
      default: false
    }
  },
  data () {
    return {
      // 表单数据
      form: {
        parentId: -1,
        name: '',
        href: '',
        icon: '',
        orderNum: 0,
        description: '',
        shown: true
      },
      // 存储上级菜单数据
      parentMenuList: [],
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入菜单描述', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请输入前端图标', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 获取上级页面信息
    this.loadMenuInfo()
  },
  methods: {
    async onSubmit () {
      // 1.表单验证
      // 2.提交表单
      const { data } = await CreateOrUpdateMenu(this.form)
      if (data.code === '000000') {
        this.$message.success('提交成功')
        this.$router.push({
          name: 'menu'
        })
      }
    },
    async loadMenuInfo () {
      // 判断是否存在参数 id
      const id = this.$route.params.id || -1
      // 请求上级菜单数据
      const { data } = await getEditMenuInfo(id)
      if (data.code === '000000') {
        // 将上级菜单数据保存,进行数据绑定
        this.parentMenuList = data.data.parentMenuList
        // 判断是否有菜单数据 menuInfo,有的话直接绑定给 form 即可
        if (data.data.menuInfo) {
          this.form = data.data.menuInfo
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
