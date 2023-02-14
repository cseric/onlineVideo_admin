<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>密码修改</span>
    </div>
    <el-form ref="passRef" :model="passForm" :rules="passRules" label-width="100px">
      <el-form-item label="原密码" prop="old_password">
        <el-input v-model="passForm.old_password" show-password></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_password">
        <el-input v-model="passForm.new_password" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="re_password">
        <el-input v-model="passForm.re_password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updatePass">修改</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { updatePassAPI } from '@/api'

export default {
  name: 'updatePass',
  data () {
    const rePwdCheck = (rule, value, callback) => {
      if (value !== this.passForm.new_password) {
        return callback(new Error('输入的密码与新密码不一致'))
      }
      callback()
    }
    return {
      passForm: {
        old_password: '',
        new_password: '',
        re_password: ''
      },
      passRules: {
        old_password: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        new_password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /^\S{6,16}$/, message: '密码至少6位，最多16位的非空字符', trigger: 'blur' }
        ],
        re_password: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: rePwdCheck, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm () {
      this.$refs.passRef.resetFields()
    },
    updatePass () {
      this.$refs.passRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await updatePassAPI(this.passForm)
        if (res.code !== 2000) return this.$message.error(res.msg)
        this.$refs.passRef.resetFields()
        // 修改成功后清除登录状态，重新登录
        this.$message.warning('密码已修改，请重新登录')
        this.$store.commit('removeAdminInfo')
        this.$store.commit('removeToken')
        await this.$router.replace('/login')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>
