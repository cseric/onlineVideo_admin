<template>
  <div class="login-container">
    <div class="login-header">
      <span>在线视频后台管理系统</span>
    </div>
    <div class="login-body">
      <div class="login-box">
        <div class="login-title">
          <h3>在线视频后台管理系统</h3>
        </div>
        <el-form ref="loginRef" :model="loginForm" :rules="loginRules">
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              show-password
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="login-btn" @click="loginValidate">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { loginAPI } from '@/api'

export default {
  name: 'adminLogin',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginValidate () {
      this.$refs.loginRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await loginAPI(this.loginForm)
        if (res.code !== 2000) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        // 保存token
        this.$store.commit('updateToken', res.data.token)
        // 保存管理员信息
        this.$store.commit('updateAdminInfo', res.data.adminInfo)
        // 跳转首页
        await this.$router.replace('/')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  max-width: 2560px;
  background: url('../assets/img/bg.png') center no-repeat;
  .login-header {
    height: 60px;
    background-color: #2f3542;
    line-height: 60px;
    color: #f1f2f6;
    font-size: 24px;
    font-weight: 650;
    span {
      margin-left: 20px;
    }
  }
  .login-body {
    height: 100%;
    min-width: 1120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .login-box {
    width: 375px;
    height: 300px;
    padding: 0 30px;
    box-sizing: border-box;
    border-radius: 5px;
    background-color: #FFF;
  }
  .login-title {
    height: 60px;
    padding: 10px 0;
    text-align: center;
    font-size: 20px;
    color: #1e90ff;
  }
  .login-btn {
    width: 100%;
  }
}
</style>
