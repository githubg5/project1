<template>
  <!-- users -->
  <div class="users">
    <!-- el-breadcrumb -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- el-card -->
    <el-card shadow="hover">
      <!-- el-row -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="usersQuery.query" placeholder="请输入内容" clearable @clear="getUsersData">
            <el-button slot="append" icon="el-icon-search" @click="getUsersData"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- el-table -->
      <el-table :data="usersData" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="handleStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editUserOpen(scope.row.id)"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- el-pagination -->
      <el-pagination :page-size="usersQuery.pagesize" :total="total" :current-page="usersQuery.pagenum" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[5, 10, 20, 30]" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
    </el-card>
    <!-- el-dialog -->
    <el-dialog :visible.sync="addUserVisible" title="添加用户" @close="addUserClose">
      <el-form :model="addUserForm" :rules="addUserRules" label-width="70px" ref="addUserRef">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="addUserForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- el-dialog -->
    <el-dialog :visible.sync="editUserVisible" title="修改用户" @close="editUserClose">
      <el-form :model="editUserForm" :rules="editUserRules" label-width="70px" ref="editUserRef">
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data () {
    var emailValidator = (rule, value, callback) => {
      const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (emailReg.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    var mobileValidator = (rule, value, callback) => {
      const mobileReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (mobileReg.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      usersQuery: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      usersData: [],
      total: 0,
      addUserVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: emailValidator, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: mobileValidator, trigger: 'blur' }
        ]
      },
      editUserVisible: false,
      editUserForm: {},
      editUserRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: emailValidator, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: mobileValidator, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUsersData()
  },
  methods: {
    async getUsersData () {
      const { data: res } = await this.$axios.get('users', {
        params: this.usersQuery
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.usersData = res.data.users
      this.total = res.data.total
    },
    async handleStateChange (user) {
      const { data: res } = await this.$axios.put(`users/${user.id}/state/${user.mg_state}`)
      if (res.meta.status !== 200) {
        user.mg_state = !user.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    handleSizeChange (pagesize) {
      this.usersQuery.pagesize = pagesize
      this.getUsersData()
    },
    handleCurrentChange (pagenum) {
      this.usersQuery.pagenum = pagenum
      this.getUsersData()
    },
    addUserClose () {
      this.$refs.addUserRef.resetFields()
    },
    addUser () {
      this.$refs.addUserRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$axios.post('users', this.addUserForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.addUserVisible = false
        this.getUsersData()
      })
    },
    async editUserOpen (id) {
      const { data: res } = await this.$axios.get(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editUserForm = res.data
      this.editUserVisible = true
    },
    editUserClose () {
      this.$refs.editUserRef.resetFields()
    },
    editUser () {
      this.$refs.editUserRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$axios.put(`users/${this.editUserForm.id}`, {
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editUserVisible = false
        this.getUsersData()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.users {
}
.el-card, .el-table, .el-pagination {
  margin-top: 15px;
}
</style>
