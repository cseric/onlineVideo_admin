<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>评论列表</span>
      </div>
      <!--搜索区域-->
      <div class="search-box">
        <el-input v-model="inputKeyword" placeholder="支持用户id、视频id以及用户名搜索"></el-input>
        <el-button type="primary" @click="searchComment"><i class="el-icon-search"></i> 查询</el-button>
        <el-button @click="resetSearch"><i class="el-icon-refresh"></i> 重置</el-button>
      </div>
      <!--视频列表-->
      <el-table :data="this.commentList" border stripe style="width: 100%">
        <el-table-column fixed width="100" prop="id" label="评论id"></el-table-column>
        <el-table-column prop="vid" label="视频id"></el-table-column>
        <el-table-column width="320" prop="title" label="视频标题"></el-table-column>
        <el-table-column prop="uid" label="用户id"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column width="320" prop="content" label="评论内容"></el-table-column>
        <el-table-column width="200" prop="comment_time" label="评论时间">
          <template v-slot="scope">
            <span>{{ $formatTime(scope.row.comment_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="100" label="操作">
          <template v-slot="scope">
            <el-button type="danger" size="mini" @click="deleteComment(scope.row.id)">
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
  </div>
</template>

<script>
import { deleteCommentAPI, getCommentList, searchCommentAPI } from '@/api'

export default {
  name: 'commentList',
  created () {
    this.getCommentList()
  },
  data () {
    return {
      commentList: [],
      total: 0,
      inputKeyword: '',
      searchKeyword: '',
      params: {
        page: 1,
        pageSize: 5
      }
    }
  },
  methods: {
    // 获取评论列表
    async getCommentList () {
      const { data: res } = await getCommentList(this.params)
      if (res.code === 2000) {
        this.commentList = res.data.comments
        this.total = res.data.total
      }
    },
    // 重置搜索
    resetSearch () {
      this.inputKeyword = ''
      this.searchKeyword = ''
      this.params.page = 1
      this.params.pageSize = 5
      this.getCommentList()
    },
    // 搜索评论
    searchComment () {
      if (this.inputKeyword === '') return this.$message.error('请输入搜索内容')
      this.searchKeyword = this.inputKeyword
      this.params.page = 1
      this.params.pageSize = 5
      this.doSearchComment()
    },
    async doSearchComment () {
      const { data: res } = await searchCommentAPI({ keyword: this.searchKeyword, ...this.params })
      if (res.code === 2000) {
        this.commentList = res.data.comments
        this.total = res.data.total
      }
    },
    // pageSize发生变化时
    sizeChangeHandler (newSize) {
      this.params.pageSize = newSize
      this.params.page = 1
      if (this.searchKeyword !== '') this.doSearchComment()
      else this.getCommentList()
    },
    // page发生变化时
    currentChangeHandler (newPage) {
      this.params.page = newPage
      if (this.searchKeyword !== '') this.doSearchComment()
      else this.getCommentList()
    },
    async deleteComment (id) {
      const confirmResult = await this.$confirm('确定要删除这条评论吗？', '提示', {
        confirmButtonText: '我已确定',
        cancelButtonText: '暂不',
        type: 'warning'
      }).catch((err) => err)
      // 取消
      if (confirmResult === 'cancel') return
      const { data: res } = await deleteCommentAPI(id)
      if (res.code !== 2000) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      // 删除当前页的最后一条记录时
      if (this.commentList.length === 1 && this.params.page > 1) {
        this.params.page--
      }
      // 判断是否处于搜索状态
      if (this.searchKeyword !== '') await this.doSearchComment()
      else await this.getCommentList()
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
</style>
