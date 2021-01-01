<template>
  <!-- 欢迎 -->
  <div class="welcome">
    <h2>Welcome,{{ username }}!</h2>
    <p>欢迎使用商城后台管理系统！</p>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  data () {
    return {
      username: sessionStorage.getItem('username')
    }
  }
}
</script>

<style scoped lang="scss">
.welcome {
  text-align: center;
  color: #409eff;
  h2, p {
    margin: 100px 0 0;
    font: {
      weight: normal;
      size: 30px;
    }
  }
}
</style>
