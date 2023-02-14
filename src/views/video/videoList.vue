<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>视频列表</span>
      </div>
      <!--搜索区域-->
      <div class="search-box">
        <el-input v-model="inputKeyword" placeholder="支持视频id和视频标题搜索"></el-input>
        <el-button type="primary" @click="searchVideo"><i class="el-icon-search"></i> 查询</el-button>
        <el-button @click="resetSearch"><i class="el-icon-refresh"></i> 重置</el-button>
      </div>
      <!--视频列表-->
      <el-table :data="this.videoList" border stripe style="width: 100%">
        <el-table-column fixed width="100" prop="id" label="视频id"></el-table-column>
        <el-table-column width="320" prop="title" label="视频标题"></el-table-column>
        <el-table-column prop="cover" label="视频封面">
          <template v-slot="scope">
            <span v-if="!scope.row.cover">暂无封面</span>
            <el-link v-else type="primary" @click="showCover(scope.row.cover)">查看封面</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="视频">
          <template v-slot="scope">
            <span v-if="!scope.row.path">暂无视频</span>
            <el-link v-else type="primary" @click="showVideo(scope.row.path)">查看视频</el-link>
          </template>
        </el-table-column>
        <el-table-column width="270" prop="brief" label="视频简介"></el-table-column>
        <el-table-column prop="uid" label="作者id"></el-table-column>
        <el-table-column prop="likes" label="点赞数"></el-table-column>
        <el-table-column prop="collect" label="收藏数"></el-table-column>
        <el-table-column width="200" prop="upload_time" label="上传时间">
          <template v-slot="scope">
            <span>{{ $formatTime(scope.row.upload_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" prop="remark" label="备注"></el-table-column>
        <el-table-column fixed="right" width="180" label="操作">
          <template v-slot="scope">
            <el-button type="warning" size="mini" @click="showReturnVideo(scope.row.id)">
              <i class="el-icon-warning-outline"></i> 下架
            </el-button>
            <el-button type="danger" size="mini" @click="deleteVideo(scope.row.id)">
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
    <el-dialog width="800px" title="查看封面" append-to-body :visible.sync="showCoverVisible" :close="handleCoverClose">
      <img alt="" class="cover-img" :src="covURL"/>
    </el-dialog>
    <el-dialog width="800px" title="查看视频" append-to-body :visible.sync="showVideoVisible" :close="handleVideoClose">
      <my-player :url="vidURL"></my-player>
    </el-dialog>
    <el-dialog width="500px" title="下架视频" append-to-body :visible.sync="returnVideoVisible" :before-close="handleReturnClose">
      <el-form ref="returnVideoRef" :model="returnVideoForm" :rules="returnVideoRules" label-width="80px">
        <el-form-item label="视频id">
          <el-input v-model="returnVideoForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="下架原因" prop="remark">
          <el-input v-model="returnVideoForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelReturn" size="medium">取消</el-button>
        <el-button type="primary" @click="returnVideo" size="medium">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { AuditFailAPI, deleteVideoAPI, getVideoListAPI, searchVideoAPI } from '@/api'
import { coverURL, videoURL } from '@/utils/request'
import MyPlayer from '@/components/MyPlayer'

export default {
  name: 'videoList',
  components: {
    'my-player': MyPlayer
  },
  async created () {
    await this.getVideoList()
  },
  data () {
    return {
      videoList: [],
      total: 0,
      inputKeyword: '',
      searchKeyword: '',
      showCoverVisible: false,
      showVideoVisible: false,
      returnVideoVisible: false,
      covURL: '',
      vidURL: '',
      params: {
        page: 1,
        pageSize: 5
      },
      returnVideoForm: {
        id: 0,
        remark: ''
      },
      returnVideoRules: {
        remark: [
          { required: true, message: '请输入退回原因', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取视频列表
    async getVideoList () {
      const { data: res } = await getVideoListAPI(this.params)
      if (res.code === 2000) {
        this.videoList = res.data.videos
        this.total = res.data.total
      }
    },
    // 重置搜索
    resetSearch () {
      this.inputKeyword = ''
      this.searchKeyword = ''
      this.params.page = 1
      this.params.pageSize = 5
      this.getVideoList()
    },
    // 搜索视频
    searchVideo () {
      if (this.inputKeyword === '') return this.$message.error('请输入搜索内容')
      this.searchKeyword = this.inputKeyword
      this.params.page = 1
      this.params.pageSize = 5
      this.doSearchVideo()
    },
    async doSearchVideo () {
      const { data: res } = await searchVideoAPI({ keyword: this.searchKeyword, ...this.params })
      if (res.code === 2000) {
        this.videoList = res.data.videos
        this.total = res.data.total
      }
    },
    // pageSize发生变化时
    sizeChangeHandler (newSize) {
      this.params.pageSize = newSize
      this.params.page = 1
      if (this.searchKeyword !== '') this.doSearchVideo()
      else this.getVideoList()
    },
    // page发生变化时
    currentChangeHandler (newPage) {
      this.params.page = newPage
      if (this.searchKeyword !== '') this.doSearchVideo()
      else this.getVideoList()
    },
    // 显示封面
    showCover (coverName) {
      this.covURL = coverURL + coverName
      this.showCoverVisible = true
    },
    // 显示视频
    showVideo (videoName) {
      this.vidURL = videoURL + videoName
      this.showVideoVisible = true
    },
    showReturnVideo (vid) {
      this.returnVideoForm.id = vid
      this.returnVideoVisible = true
    },
    handleCoverClose () {
      this.covURL = ''
      this.showCoverVisible = false
    },
    handleVideoClose () {
      this.vidURL = ''
      this.showVideoVisible = false
    },
    handleReturnClose (done) {
      this.$refs.returnVideoRef.resetFields()
      done()
    },
    cancelReturn () {
      this.$refs.returnVideoRef.resetFields()
      this.returnVideoVisible = false
    },
    async deleteVideo (id) {
      const confirmResult = await this.$confirm('确定要删除这个视频吗？', '提示', {
        confirmButtonText: '我已确定',
        cancelButtonText: '暂不',
        type: 'warning'
      }).catch((err) => err)
      // 取消
      if (confirmResult === 'cancel') return
      const { data: res } = await deleteVideoAPI(id)
      if (res.code !== 2000) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      // 删除当前页的最后一条记录时
      if (this.videoList.length === 1 && this.params.page > 1) {
        this.params.page--
      }
      // 判断是否处于搜索状态
      if (this.searchKeyword !== '') await this.doSearchVideo()
      else await this.getVideoList()
    },
    returnVideo () {
      this.$refs.returnVideoRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await AuditFailAPI(this.returnVideoForm)
        if (res.code !== 2000) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.returnVideoVisible = false
        // 判断是否处于搜索状态
        if (this.searchKeyword !== '') await this.doSearchVideo()
        else await this.getVideoList()
      })
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
.cover-img {
  width: 100%;
}
</style>
