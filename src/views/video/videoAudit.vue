<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="flex">
        <span>审核列表</span>
        <el-button type="text" @click="refreshData"><i class="el-icon-refresh"></i> 刷新</el-button>
      </div>
      <!--视频列表-->
      <el-table :data="this.auditVideoList" border stripe style="width: 100%">
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
        <el-table-column fixed="right" width="200" label="操作">
          <template v-slot="scope">
            <el-button type="success" size="mini" @click="auditPass(scope.row.id)">
              <i class="el-icon-check"></i> 通过
            </el-button>
            <el-button type="danger" size="mini" @click="showAudit(scope.row.id)">
              <i class="el-icon-close"></i> 退回
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
    <el-dialog width="800px" title="查看封面" append-to-body :visible.sync="showCoverVisible" :before-close="handleCoverClose">
      <img alt="" class="cover-img" :src="covURL"/>
    </el-dialog>
    <el-dialog width="800px" title="查看视频" append-to-body :visible.sync="showVideoVisible" :before-close="handleVideoClose">
      <video class="user-video" :src="vidURL" controls></video>
    </el-dialog>
    <el-dialog width="500px" title="退回提示" append-to-body :visible.sync="showAuditVisible" :close="handleAuditClose">
      <el-form ref="auditRef" :model="auditForm" :rules="auditRules" label-width="80px">
        <el-form-item label="视频id">
          <el-input v-model="auditForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="退回原因" prop="remark">
          <el-input v-model="auditForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelAudit" size="medium">取 消</el-button>
        <el-button type="primary" @click="auditFail" size="medium">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { AuditFailAPI, AuditPassAPI, getAuditVideoListAPI } from '@/api'
import { coverURL, videoURL } from '@/utils/request'

export default {
  name: 'videoAudit',
  created () {
    this.getAuditVideoList()
  },
  data () {
    return {
      auditVideoList: [],
      total: 0,
      covURL: '',
      vidURL: '',
      showCoverVisible: false,
      showVideoVisible: false,
      showAuditVisible: false,
      params: {
        page: 1,
        pageSize: 5
      },
      auditForm: {
        id: 0,
        remark: ''
      },
      auditRules: {
        remark: [
          { required: true, message: '请输入退回原因', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取审核视频列表
    async getAuditVideoList () {
      const { data: res } = await getAuditVideoListAPI(this.params)
      if (res.code === 2000) {
        this.auditVideoList = res.data.videos
        this.total = res.data.total
      }
    },
    showCover (coverName) {
      this.covURL = coverURL + coverName
      this.showCoverVisible = true
    },
    showVideo (videoName) {
      this.vidURL = videoURL + videoName
      this.showVideoVisible = true
    },
    showAudit (id) {
      this.showAuditVisible = true
      this.$nextTick(() => {
        this.auditForm.id = id
      })
    },
    cancelAudit () {
      this.showAuditVisible = false
    },
    handleCoverClose (done) {
      this.covURL = ''
      done()
    },
    handleVideoClose (done) {
      this.vidURL = ''
      done()
    },
    handleAuditClose () {
      this.$refs.auditRef.resetFields()
    },
    refreshData () {
      this.params.page = 1
      this.params.pageSize = 5
      this.getAuditVideoList()
    },
    sizeChangeHandler (newSize) {
      this.params.pageSize = newSize
      this.params.page = 1
      this.getAuditVideoList()
    },
    currentChangeHandler (newPage) {
      this.params.page = newPage
      this.getAuditVideoList()
    },
    async auditPass (id) {
      const confirmResult = await this.$confirm('确定要通过这个视频的审核吗？', '提示', {
        confirmButtonText: '我已确定',
        cancelButtonText: '暂不',
        type: 'info'
      }).catch((err) => err)
      // 取消
      if (confirmResult === 'cancel') return
      const { data: res } = await AuditPassAPI(id)
      if (res.code !== 2000) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      this.refreshData()
    },
    auditFail () {
      this.$refs.auditRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await AuditFailAPI(this.auditForm)
        if (res.code !== 2000) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.showAuditVisible = false
        this.refreshData()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cover-img {
  width: 100%;
}
.user-video {
  width: 100%;
}
</style>
