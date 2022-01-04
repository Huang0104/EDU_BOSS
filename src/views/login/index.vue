<template>
  <div class="login">
    <header class="header">
      <h1>Edu boss管理系统</h1>
    </header>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="top"
    >
      <h2>登录</h2>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="isLoginLoading"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入请求模块 request
// import request from '@/utils/request'
// 引入请求格式参数转换插件
// import qs from 'qs'
// 引入封装的用户接口
import { login } from "@/services/user";
export default {
  name: "LoginIndex",
  data() {
    return {
      // 用于进行数据绑定对象
      form: {
        phone: "",
        password: "",
      },
      // 表单验证的规则对象
      rules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1\d{10}$/,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "密码长度应该在6到18位之间",
            trigger: "blur",
          },
        ],
      },
      // 默认处于不加载，（不登录）
      isLoginLoading: false,
    };
  },
  methods: {
    // 登录功能
    async onSubmit() {
      try {
        // 1.表单验证
        await this.$refs.form.validate();

        // 点击事件触发,处于加载中
        this.isLoginLoading = true;
        // 2.发送请求
        // const { data } = await request({
        //   // method: 'POST',
        //   // url: '/front/user/login',
        //   // headers: { 'content-ttype': 'application/x-www-gorm-rlencoded' },
        //   // urlencoded格式 名=值&名=值
        //   // data: {
        //   //   phone: this.form.phone,
        //   //   password: this.form.password
        //   // }
        //   // 使用 qs 自动转换参数格式
        //   // data: qs.stringify(this.form)
        // })
        const { data } = await login(this.form);
        // 请求结束，处于不加载中
        this.isLoginLoading = false;
        // 3.响应处理
        if (data.state === 1) {
          // 登录成功消息提示
          this.$message.success("登录成功");
          // 记录登录状态，存储到 Vuex 中
          this.$store.commit("setUser", data.content);
          // 成功响应,跳转到首页
          this.$router.push(this.$route.query.redirect || "/");
        } else {
          // 登录失败消息提示
          this.$message.error("手机号或者密码错误");
        }
      } catch (msg) {
        console.log(msg);
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.login {
  height: 100vh;
  display: flex;
  // 水平居中
  justify-content: center;
  // 垂直居中
  align-items: center;
  .header {
    margin-left: -315px;
    width: 315px;
    height: 125px;
    h1 {
      width: 315px;
      margin-top: -200px;
      margin-left: 330px;
      // margin:72px 0px 56px;
      color: #00000080;
      font-size: 48px;
      font-family: "宋体";
    }
  }
  .el-form {
    margin-top: 170px;
    width: 315px;
    padding: 20px;
    background-color: #fff;
  }
  .el-button {
    width: 100%;
  }
}
</style>
