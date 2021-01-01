<template>
  <!-- 用户列表 -->
  <div class="users">
    <!-- 当前位置 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <!-- 搜索 -->
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
      <!-- 列表 -->
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
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editUserShow(scope.row.id)"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeUser(scope.row.id)"></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button size="mini" type="warning" icon="el-icon-setting" @click="setRoleShow(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination :page-size="usersQuery.pagesize" :total="total" :current-page="usersQuery.pagenum" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[5, 10, 20, 30]" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
    </el-card>
    <!-- 添加用户 -->
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
    <!-- 编辑用户 -->
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
    <!-- 分配角色 -->
    <el-dialog :visible.sync="setRoleVisible" title="分配角色" @close="setRoleClose">
      <div class="setRole">
        <section>当前用户：{{ setRoleUser.username }}</section>
        <section>当前角色：{{ setRoleUser.role_name }}</section>
        <section>
          分配新角色：
          <el-select v-model="setRoleValue" placeholder="请选择">
            <el-option v-for="item in setRoleSelect" :key="item.id" :value="item.id" :label="item.roleName"></el-option>
          </el-select>
        </section>
      </div>
      <div slot="footer">
        <el-button @click="setRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data () {
    // 邮箱校验规则
    var emailValidator = (rule, value, callback) => {
      const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (emailReg.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 手机号校验规则
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
      },
      setRoleVisible: false,
      setRoleUser: {},
      setRoleValue: '',
      setRoleSelect: []
    }
  },
  created () {
    this.getUsersData()
  },
  methods: {
    // 获取用户列表
    async getUsersData () {
      const { data: res } = await this.$axios.get('users', {
        params: this.usersQuery
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.usersData = res.data.users
      this.total = res.data.total
    },
    // 修改所选用户状态
    async handleStateChange (user) {
      const { data: res } = await this.$axios.put(`users/${user.id}/state/${user.mg_state}`)
      if (res.meta.status !== 200) {
        user.mg_state = !user.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 监听每页条数改变
    handleSizeChange (pagesize) {
      this.usersQuery.pagesize = pagesize
      this.getUsersData()
    },
    // 监听页码改变
    handleCurrentChange (pagenum) {
      this.usersQuery.pagenum = pagenum
      this.getUsersData()
    },
    // 重置添加用户表单
    addUserClose () {
      this.$refs.addUserRef.resetFields()
    },
    // 添加用户
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
    // 显示所选编辑用户信息
    async editUserShow (id) {
      const { data: res } = await this.$axios.get(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editUserForm = res.data
      this.editUserVisible = true
    },
    // 重置编辑用户表单
    editUserClose () {
      this.$refs.editUserRef.resetFields()
    },
    // 修改所选编辑用户信息
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
    },
    // 删除所选用户
    async removeUser (id) {
      const confirmValue = await this.$confirm('此操作将永久删除该文件，是否继续？', '提示', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }).catch(err => err)
      if (confirmValue !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$axios.delete(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getUsersData()
    },
    // 显示所选分配角色用户信息
    async setRoleShow (user) {
      this.setRoleUser = user
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.setRoleSelect = res.data
      this.setRoleVisible = true
    },
    // 重置分配角色表单
    setRoleClose () {
      this.setRoleUser = {}
      this.setRoleValue = ''
    },
    // 修改所选分配角色用户信息
    async setRole () {
      if (!this.setRoleValue) return this.$message.error('请选择要分配的角色')
      const { data: res } = await this.$axios.put(`users/${this.setRoleUser.id}/role`, {
        rid: this.setRoleValue
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.setRoleVisible = false
      this.getUsersData()
    }
  }
}
</script>

<style scoped lang="scss">
.el-card, .el-table, .el-pagination {
  margin-top: 15px;
}
.setRole {
  line-height: 40px;
}
</style>
