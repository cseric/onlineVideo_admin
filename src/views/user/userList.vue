<template>
  <div>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>用户列表</span>
    </div>
    <!--搜索区域-->
    <div class="search-box">
      <el-input v-model="inputKeyword" placeholder="支持用户id和用户名搜索"></el-input>
      <el-button type="primary" @click="searchUser"><i class="el-icon-search"></i> 查询</el-button>
      <el-button @click="resetSearch"><i class="el-icon-refresh"></i> 重置</el-button>
    </div>
    <!--用户列表-->
    <el-table :data="this.userList" border stripe style="width: 100%">
      <el-table-column prop="id" label="用户id" width="120px"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="avatar" label="用户头像" width="120px">
        <template v-slot="scope">
          <span v-if="!scope.row.avatar">暂无头像</span>
          <el-link v-else type="primary" @click="showAvatar(scope.row.avatar)">查看头像</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="性别" width="120px">
        <template v-slot="scope">
          <span>{{ showGender(scope.row.gender) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sign" label="个性签名">
        <template v-slot="scope">
          <span v-if="!scope.row.sign">暂无签名</span>
          <span v-else>{{ scope.row.sign }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template v-slot="scope">
          <el-button type="danger" size="mini" @click="deleteUser(scope.row.id, scope.row.username)">
            <i class="el-icon-delete"></i> 删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      @size-change="sizeChangeHandler"
      @current-change="currentChangeHandler"
      :current-page.sync="params.page"
      :page-sizes="[3, 5, 10, 20]"
      :page-size.sync="params.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
    <!--对话框-->
  <el-dialog width="500px" title="查看头像" append-to-body :visible.sync="showAvatarVisible" :before-close="handleClose">
    <img alt="" class="avatar-img" :src="avtURL"/>
  </el-dialog>
  </div>
</template>

<script>
import { deleteUserAPI, getUserListAPI, searchUserAPI } from '@/api'
import { avatarURL } from '@/utils/request'

export default {
  name: 'userList',
  created () {
    this.getUserList()
  },
  data () {
    return {
      userList: [],
      total: 0,
      inputKeyword: '',
      searchKeyword: '',
      showAvatarVisible: false,
      avtURL: '',
      params: {
        page: 1,
        pageSize: 5
      }
    }
  },
  methods: {
    // 获取用户列表
    async getUserList () {
      const { data: res } = await getUserListAPI(this.params)
      if (res.code === 2000) {
        this.userList = res.data.users
        this.total = res.data.total
      }
    },
    // 显示文字形式的性别
    showGender (gender) {
      if (gender === 0) return '保密'
      else if (gender === 1) return '男'
      else if (gender === 2) return '女'
    },
    // 重置搜索
    resetSearch () {
      this.inputKeyword = ''
      this.searchKeyword = ''
      this.params.page = 1
      this.params.pageSize = 5
      this.getUserList()
    },
    // 搜索
    searchUser () {
      if (this.inputKeyword === '') return this.$message.error('请输入搜索内容')
      this.searchKeyword = this.inputKeyword
      this.params.page = 1
      this.params.pageSize = 5
      this.doSearchUser()
    },
    // 执行搜索操作
    async doSearchUser () {
      const { data: res } = await searchUserAPI({ keyword: this.searchKeyword, ...this.params })
      if (res.code === 2000) {
        this.userList = res.data.users
        this.total = res.data.total
      }
    },
    // pageSize发生改变时
    sizeChangeHandler (newSize) {
      this.params.pageSize = newSize
      this.params.page = 1
      if (this.searchKeyword !== '') this.doSearchUser()
      else this.getUserList()
    },
    // page发生改变时
    currentChangeHandler (newPage) {
      this.params.page = newPage
      if (this.searchKeyword !== '') this.doSearchUser()
      else this.getUserList()
    },
    // 显示用户头像对话框
    showAvatar (avatarName) {
      this.avtURL = avatarURL + avatarName
      this.showAvatarVisible = true
    },
    // 处理用户头像对话框关闭前的操作
    handleClose (done) {
      this.avtURL = ''
      done()
    },
    // 删除用户
    async deleteUser (id) {
      const confirmResult = await this.$confirm('确定要删除这个用户吗？', '提示', {
        confirmButtonText: '我已确定',
        cancelButtonText: '暂不',
        type: 'warning'
      }).catch((err) => err)
      // 取消
      if (confirmResult === 'cancel') return
      const { data: res } = await deleteUserAPI(id)
      if (res.code !== 2000) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      // 删除当前页的最后一条记录时
      if (this.userList.length === 1 && this.params.page > 1) {
        this.params.page--
      }
      // 判断是否处于搜索状态
      if (this.searchKeyword !== '') await this.doSearchUser()
      else await this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: flex-start;
  margin: 15px 0;
  .el-input {
    width: 270px;
    margin-right: 10px;
  }
}
.el-pagination {
  margin-top: 10px;
}
.avatar-img {
  width: 100%;
}
</style>
