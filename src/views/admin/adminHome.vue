<template>
  <el-card>
    <div slot="header">
      <span>欢迎你，
        <span class="role-tag">{{ $store.getters.role }}</span>
        <span class="user-name">{{ $store.getters.username }}</span>
      </span>
    </div>
    <div class="home-body">
      <div class="home-item">
        <div class="item-title">
          <span>管理员</span>
        </div>
        <div class="item-body">
          <span>{{ admins }}</span>
        </div>
        <div class="item-footer" @click="$router.push('/admin-list')">
          <span>前往管理</span>
        </div>
      </div>
      <div class="home-item">
        <div class="item-title">
          <span>用户</span>
        </div>
        <div class="item-body">
          <span>{{ users }}</span>
        </div>
        <div class="item-footer" @click="$router.push('/user-list')">
          <span>前往管理</span>
        </div>
      </div>
      <div class="home-item">
        <div class="item-title">
          <span>过审视频</span>
        </div>
        <div class="item-body">
          <span>{{ videos }}</span>
        </div>
        <div class="item-footer" @click="$router.push('/video-list')">
          <span>前往管理</span>
        </div>
      </div>
      <div class="home-item">
        <div class="item-title">
          <span>待审视频</span>
        </div>
        <div class="item-body">
          <span>{{ audits }}</span>
        </div>
        <div class="item-footer" @click="$router.push('/audit-list')">
          <span>前往管理</span>
        </div>
      </div>
      <div class="home-item">
        <div class="item-title">
          <span>评论</span>
        </div>
        <div class="item-body">
          <span>{{ comments }}</span>
        </div>
        <div class="item-footer" @click="$router.push('/comment-list')">
          <span>前往管理</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { getTotalDataAPI } from '@/api'

export default {
  name: 'adminHome',
  async created () {
    await this.getTotalData()
  },
  data () {
    return {
      admins: 0,
      users: 0,
      videos: 0,
      audits: 0,
      comments: 0
    }
  },
  methods: {
    async getTotalData () {
      const { data: res } = await getTotalDataAPI()
      if (res.code === 2000) {
        this.admins = res.data.admins
        this.users = res.data.users
        this.videos = res.data.videos
        this.audits = res.data.audits
        this.comments = res.data.comments
      }
    }
  }
}
</script>

<style lang="less" scoped>
.role-tag {
  padding: 2px 5px;
  background-color: #1e90ff;
  border-radius: 5px;
  font-size: 14px;
  color: #f1f2f6;
  margin-right: 5px;
}
.user-name {
  color: #57606f;
}
.home-body {
  margin-top: 20px;
  display: flex;
}
.home-item {
  margin: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 235px;
  border: 1px solid #ddd;
  border-radius: 7px;
}
.item-title {
  width: 100%;
  height: 40px;
  font-weight: 650;
  color: #2f3542;
  text-align: center;
  line-height: 40px;
}
.item-body {
  width: 100%;
  height: 120px;
  line-height: 120px;
  font-size: 36px;
  text-align: center;
  color: #ffa502;
}
.item-footer {
  height: 40px;
  line-height: 40px;
  width: 100%;
  font-size: 14px;
  color: #1e90ff;
  border-top: 1px solid #ddd;
  text-align: center;
  cursor: pointer;
}
</style>
