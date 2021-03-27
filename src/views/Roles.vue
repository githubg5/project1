<template>
  <!-- 角色列表 -->
  <div class="roles">
    <!-- 当前位置 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-table :data="rolesData" stripe border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="item1 in scope.row.children" :key="item1.id" class="roles-border">
              <el-col :span="5">
                <el-tag closable @close="removeRoleRight(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="item2 in item1.children" :key="item2.id" class="roles-border">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRoleRight(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="item3 in item2.children" :key="item3.id" type="warning" closable @close="removeRoleRight(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRoleShow(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRole(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="setRoleRightsShow(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog :visible.sync="addRoleVisible" title="添加角色" @close="addRoleClose">
      <el-form :model="addRoleForm" :rules="addRoleRules" label-width="80px" ref="addRoleRef">
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item prop="roleDesc" label="角色描述">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog :visible.sync="editRoleVisible" title="修改角色" @close="editRoleClose">
      <el-form :model="editRoleForm" :rules="editRoleRules" label-width="80px" ref="editRoleRef">
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item prop="roleDesc" label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog :visible.sync="setRoleRightsVisible" title="分配权限" @close="setRoleRightsClose">
      <el-tree :data="setRoleRightsData" node-key="id" :props="setRoleRightsProps" default-expand-all show-checkbox :default-checked-keys="setRoleRightsChecked" ref="setRoleRightsRef"></el-tree>
      <div slot="footer">
        <el-button @click="setRoleRightsVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      rolesData: [],
      addRoleVisible: false,
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      editRoleVisible: false,
      editRoleForm: {},
      editRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      setRoleRightsVisible: false,
      setRoleRightsData: [],
      setRoleRightsProps: {
        label: 'authName',
        children: 'children'
      },
      setRoleRightsChecked: [],
      roleId: ''
    }
  },
  created () {
    this.getRolesData()
  },
  methods: {
    // 获取角色列表
    async getRolesData () {
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesData = res.data
    },
    // 重置添加角色表单
    addRoleClose () {
      this.$refs.addRoleRef.resetFields()
    },
    // 添加角色
    addRole () {
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.addRoleVisible = false
        this.getRolesData()
      })
    },
    // 删除所选角色权限
    async removeRoleRight (role, rightId) {
      const confirmValue = await this.$confirm('此操作将永久删除该权限，是否继续？', '提示', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }).catch(err => err)
      if (confirmValue !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$axios.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      role.children = res.data
    },
    // 显示所选编辑角色信息
    async editRoleShow (id) {
      const { data: res } = await this.$axios.get(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editRoleForm = res.data
      this.editRoleVisible = true
    },
    // 重置编辑角色表单
    editRoleClose () {
      this.$refs.editRoleRef.resetFields()
    },
    // 修改所选编辑角色信息
    editRole () {
      this.$refs.editRoleRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.put(`roles/${this.editRoleForm.roleId}`, {
          roleName: this.editRoleForm.roleName,
          roleDesc: this.editRoleForm.roleDesc
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editRoleVisible = false
        this.getRolesData()
      })
    },
    // 删除所选角色
    async removeRole (id) {
      const confirmValue = await this.$confirm('此操作将永久删除该角色，是否继续？', '提示', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }).catch(err => err)
      if (confirmValue !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$axios.delete(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesData()
    },
    // 递归遍历三级节点id
    getRoleRightsChecked (node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => this.getRoleRightsChecked(item, arr))
    },
    // 显示所选分配权限
    async setRoleRightsShow (role) {
      this.roleId = role.id
      const { data: res } = await this.$axios.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.setRoleRightsData = res.data
      this.getRoleRightsChecked(role, this.setRoleRightsChecked)
      this.setRoleRightsVisible = true
    },
    // 重置分配权限
    setRoleRightsClose () {
      this.setRoleRightsChecked = []
    },
    // 修改所选分配权限
    async setRoleRights () {
      const rids = [...this.$refs.setRoleRightsRef.getCheckedKeys(), ...this.$refs.setRoleRightsRef.getHalfCheckedKeys()].join(',')
      const { data: res } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesData()
      this.setRoleRightsVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
.el-card, .el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
}
.roles-border {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  &:last-of-type {
    border-bottom: none;
  }
}
</style>
