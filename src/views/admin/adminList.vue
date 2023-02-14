<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="flex">
        <span>管理员列表</span>
        <el-button type="primary" size="small" @click="showAddAdmin"><i class="el-icon-plus"></i> 添加</el-button>
      </div>
        <!--管理员列表-->
        <el-table :data="this.adminList" border stripe style="width: 100%">
          <el-table-column prop="id" label="用户id" width="120px"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="authority" label="角色">
            <template v-slot="scope">
              <span>{{ showRole(scope.row.authority) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button type="primary" size="mini" @click="showUpdateAdmin(scope.row)">
                <i class="el-icon-delete"></i> 编辑
              </el-button>
              <el-button type="danger" size="mini" @click="deleteAdmin(scope.row.id)">
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
    <el-dialog width="500px" title="修改管理员" append-to-body :visible.sync="updateAdminVisible" :before-close="handleUpdateClose">
      <el-form ref="updateAdminRef" :model="updateAdminForm" label-width="80px">
        <el-form-item label="id">
          <el-input v-model="updateAdminForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="updateAdminForm.authority" placeholder="请选择角色">
            <el-option v-for="item in roleList" :key="item.auth" :label="item.role" :value="item.auth"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelUpdate">取消</el-button>
          <el-button type="primary" @click="updateAdmin">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog width="500px" title="添加管理员" append-to-body :visible.sync="addAdminVisible" :before-close="handleAddClose">
      <el-form ref="addAdminRef" :model="addAdminForm" :rules="addAdminRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addAdminForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addAdminForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="authority">
          <el-select v-model="addAdminForm.authority" placeholder="请选择角色">
            <el-option v-for="item in roleList" :key="item.auth" :label="item.role" :value="item.auth"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelAdd">取消</el-button>
          <el-button type="primary" @click="addAdmin">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { addAdminAPI, deleteAdminAPI, getAdminListAPI, updateAdminAPI } from '@/api'

export default {
  name: 'adminList',
  async created () {
    await this.getAdminList()
  },
  data () {
    return {
      adminList: [],
      total: 0,
      updateAdminVisible: false,
      addAdminVisible: false,
      params: {
        page: 1,
        pageSize: 5
      },
      roleList: [
        { role: '审核员', auth: 1 },
        { role: '管理员', auth: 2 }
      ],
      updateAdminForm: {
        id: 0,
        authority: ''
      },
      addAdminForm: {
        username: '',
        password: '',
        authority: ''
      },
      addAdminRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码至少六位', trigger: 'blur' }
        ],
        authority: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    showRole (auth) {
      if (auth === 1) {
        return '审核员'
      } else if (auth === 2) {
        return '管理员'
      }
    },
    showUpdateAdmin (admin) {
      this.updateAdminVisible = true
      this.$nextTick(() => {
        this.updateAdminForm.id = admin.id
        this.updateAdminForm.authority = admin.authority
      })
    },
    showAddAdmin () {
      this.addAdminVisible = true
    },
    handleUpdateClose (done) {
      this.$refs.updateAdminRef.resetFields()
      done()
    },
    handleAddClose (done) {
      this.$refs.addAdminRef.resetFields()
      done()
    },
    cancelUpdate () {
      this.$refs.updateAdminRef.resetFields()
      this.updateAdminVisible = false
    },
    cancelAdd () {
      this.$refs.addAdminRef.resetFields()
      this.addAdminVisible = false
    },
    sizeChangeHandler (newSize) {
      this.params.pageSize = newSize
      this.params.page = 1
      this.getAdminList()
    },
    currentChangeHandler (newPage) {
      this.params.page = newPage
      this.getAdminList()
    },
    async getAdminList () {
      const { data: res } = await getAdminListAPI(this.params)
      if (res.code === 2000) {
        this.adminList = res.data.admins
        this.total = res.data.total
      }
    },
    async deleteAdmin (id) {
      this.$confirm('确定要删除这个管理员吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await deleteAdminAPI(id)
        if (res.code !== 2000) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        if (this.adminList.length === 1 && this.params.page > 1) {
          this.params.page--
        }
        await this.getAdminList()
      }).catch((err) => err)
    },
    async updateAdmin () {
      const { data: res } = await updateAdminAPI(this.updateAdminForm)
      if (res.code !== 2000) return this.$message.error(res.msg)
      this.$message.success(res.msg)
      this.updateAdminVisible = false
      await this.getAdminList()
    },
    addAdmin () {
      this.$refs.addAdminRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await addAdminAPI(this.addAdminForm)
        if (res.code !== 2000) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.addAdminVisible = false
        await this.getAdminList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  justify-content: space-between;
}
.el-pagination {
  margin-top: 10px;
}
</style>
