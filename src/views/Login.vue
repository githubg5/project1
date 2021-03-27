<template>
  <!-- 登录 -->
  <div class="login">
    <el-card shadow="hover">
      <el-avatar :size="150" :src="require('@/assets/logo.png')"></el-avatar>
      <el-form :model="loginForm" :rules="loginRules" ref="loginRef">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" clearable prefix-icon="el-icon-s-custom"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" clearable show-password prefix-icon="el-icon-s-goods"></el-input>
        </el-form-item>
        <el-form-item class="login-btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 登录
    login () {
      this.$refs.loginRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        sessionStorage.setItem('token', res.data.token)
        sessionStorage.setItem('username', res.data.username)
        this.$router.push('/home')
      })
    },
    // 重置表单
    reset () {
      this.$refs.loginRef.resetFields()
    }
  }
}
</script>

<style scoped lang="scss">
.login {
  height: 100%;
  background-color: #2b4b6b;
}
.el-card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 450px;
  overflow: visible;
  transform: translate(-50%, -50%);
}
.el-avatar {
  position: absolute;
  left: 50%;
  border: 10px solid #fff;
  box-shadow: 0 0 10px #ddd;
  background: #eee;
  transform: translate(-50%, calc(-50% - 20px));
}
.el-form {
  margin-top: 90px;
}
.el-form-item {
  &:last-of-type {
    margin-bottom: 0;
  }
}
.login-btn {
  display: flex;
  justify-content: flex-end;
}
</style>
