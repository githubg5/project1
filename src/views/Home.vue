<template>
  <!-- home -->
  <div class="home">
    <!-- el-container -->
    <el-container>
      <!-- el-header -->
      <el-header>
        <h1>
          <el-image :src="require('@/assets/logo.png')"></el-image>
          <span>商城后台管理系统</span>
        </h1>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- el-container -->
      <el-container>
        <!-- el-aside -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="collapse" @click="setCollapse">|||</div>
          <el-menu :collapse="isCollapse" background-color="#333744" text-color="#fff" :default-active="active" unique-opened router :collapse-transition="false">
            <el-submenu v-for="(submenu, index) in menu" :key="submenu.id" :index="submenu.id + ''">
              <template slot="title">
                <i :class="menuIcon[index]"></i>
                <span>{{ submenu.authName }}</span>
              </template>
              <el-menu-item v-for="menuItem in submenu.children" :key="menuItem.id" :index="'/' + menuItem.path" @click="setActive('/' + menuItem.path)">
                <template slot="title">
                  <i class="el-icon-s-operation"></i>
                  <span>{{ menuItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- el-main -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      menu: [],
      menuIcon: [
        'el-icon-s-custom',
        'el-icon-s-tools',
        'el-icon-s-goods',
        'el-icon-s-order',
        'el-icon-s-marketing'
      ],
      active: '',
      isCollapse: false
    }
  },
  created () {
    this.getMenu()
    this.active = sessionStorage.getItem('active')
  },
  methods: {
    logout () {
      sessionStorage.clear()
      this.$router.push('/')
    },
    async getMenu () {
      const { data: res } = await this.$axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menu = res.data
    },
    setActive (index) {
      sessionStorage.setItem('active', index)
      this.active = index
    },
    setCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style scoped lang="scss">
.home, .el-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #666;
  h1 {
    display: flex;
    align-items: center;
    font: {
      weight: normal;
      size: 16px;
    }
    color: #fff;
    .el-image {
      width: 60px;
      height: 60px;
      margin-right: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.collapse {
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 2px;
  color: #fff;
  background-color: #999;
  cursor: pointer;
}
.el-menu {
  border-right: none;
}
.el-main {
  background-color: #eaedf1;
}
</style>
