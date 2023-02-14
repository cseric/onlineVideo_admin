<template>
  <div class="main-container">
    <el-container class="main-body">
      <el-header>
        <!--主页标题-->
        <span class="main-title">在线视频后台管理系统</span>
        <!--用户区域-->
        <el-dropdown placement="bottom">
          <span class="user-name" style="cursor: pointer;"><i class="el-icon-user"></i> {{ username }}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-link :underline="false" @click="toUpdatePass"><i class="el-icon-edit"></i>修改密码</el-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-link :underline="false" @click="logoutConfirm"><i class="el-icon-switch-button"></i>退出系统</el-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            background-color="#222"
            text-color="#fff"
            active-text-color="#1e90ff"
            router
          >
            <template v-for="item in navList">
              <el-menu-item v-if="!item.children" :index="item.path" :key="item.path">
                <i :class="item.icon"></i>{{ item.title }}
              </el-menu-item>
              <el-submenu v-else :index="item.path" :key="item.path">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span>{{ item.title }}</span>
                </template>
                <el-menu-item v-for="subItem in item.children" :index="subItem.path" :key="subItem.path">
                  <i :class="subItem.icon"></i>{{ subItem.title }}
                </el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
        </el-aside>
        <el-container class="main-body">
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'adminHome',
  data () {
    return {
      navList: [
        { title: '首页', path: '/home', icon: 'el-icon-house' },
        { title: '管理员管理', path: '/admin-list', icon: 'el-icon-s-custom' },
        { title: '用户管理', path: '/user-list', icon: 'el-icon-user' },
        {
          title: '视频管理',
          path: '2',
          icon: 'el-icon-video-play',
          children: [
            { title: '视频列表', path: '/video-list', icon: 'el-icon-tickets' },
            { title: '审核列表', path: '/audit-list', icon: 'el-icon-s-check' }
          ]
        },
        { title: '评论管理', path: '/comment-list', icon: 'el-icon-chat-square' }
      ]
    }
  },
  computed: {
    username () {
      return this.$store.getters.username
    }
  },
  methods: {
    logoutConfirm () {
      this.$confirm('确定要退出吗？', '提示', {
        confirmButtonText: '退出',
        cancelButtonText: '暂不',
        type: 'warning'
      }).then(() => {
        this.$store.commit('removeAdminInfo')
        this.$store.commit('removeToken')
        this.$router.replace('/login')
      }).catch((err) => err)
    },
    toUpdatePass () {
      this.$router.push('/update-pass').catch((err) => err)
    }
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
  max-width: 2560px;
}
.main-body {
  height: 100%;
  min-width: 1120px;
  .main-title {
    color: #f1f2f6;
    font-size: 24px;
    line-height: 60px;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    background-color: #2f3542;
    .el-dropdown {
      line-height: 60px;
      color: #f1f2f6;
    }
    .user-name {
      font-size: 16px;
    }
  }
  .el-aside {
    background-color: #222;
    .el-menu {
      .el-submenu,
      .el-menu-item {
        width: 200px;
        user-select: none;
        border-bottom: 1px solid #333;
        box-sizing: border-box;
      }
    }
  }
  .el-main {
    overflow-y: auto;
    background-color: #F2F2F2;
  }
  .main-body {
    position: fixed;
    top: 60px;
    left: 200px;
    right: 0;
    bottom: 0;
  }
}
</style>
