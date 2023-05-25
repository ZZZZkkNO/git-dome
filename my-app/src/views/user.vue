<template>
  <div>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="permission" label="权限"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editUser(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteUser(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-button type="primary" @click="addUser">添加用户</el-button>

    <el-dialog title="添加用户" :visible.sync="dialogVisible">
      <el-form :model="newUser" :rules="rules" ref="newUserForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="newUser.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="newUser.phone"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="permission">
          <el-select v-model="newUser.permission" placeholder="请选择">
            <el-option label="普通用户" value="user"></el-option>
            <el-option label="管理员" value="admin"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addUserConfirm">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑用户" :visible.sync="editDialogVisible">
      <el-form :model="editUserForm" :rules="rules" ref="editUserForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editUserForm.phone" disabled></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="permission">
          <el-select v-model="editUserForm.permission" placeholder="请选择">
            <el-option label="普通用户" value="user"></el-option>
            <el-option label="管理员" value="admin"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editUserConfirm">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserInfo, editUserInfo } from '@/api';
export default{
  data() {
    return {
      users: [],
      dialogVisible: false,
      newUser: {
        username: '',
        phone: '',
        permission: ''
      },
      rules: {
        username: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        permission: [{ required: true, message: '请选择权限', trigger: 'change' }]
      },
      editDialogVisible: false,
      editUserForm: {
        username: '',
        phone: '',
        permission: ''
      },
      editIndex: -1
    };
  },
  methods: {
    addUser() {
      this.dialogVisible = true;
    },
    addUserConfirm() {
      this.$refs.newUserForm.validate(valid => {
        if (valid) {
          this.users.push({
            username: this.newUser.username,
            phone: this.newUser.phone,
            permission: this.newUser.permission
          });
          this.dialogVisible = false;
          this.$message.success('添加成功');
        }
      });
    },
    editUser(user) {
      // 将当前选择的用户信息存储到表单中
      this.editUserForm.username = user.username;
      this.editUserForm.phone = user.phone;
      this.editUserForm.permission = user.permission;
      this.editIndex = this.users.indexOf(user);
      this.editDialogVisible = true;
    },
    editUserConfirm() {
      this.$refs.editUserForm.validate(valid => {
        if (valid) {
          // 更新用户信息
          this.users.splice(this.editIndex, 1, {
            username: this.editUserForm.username,
            phone: this.editUserForm.phone,
            permission: this.editUserForm.permission
          });
          editUserInfo(JSON.stringify({username: this.editUserForm.username, permission: this.editUserForm.permission}))
          this.editDialogVisible = false;
          this.$message.success('保存成功');
        }
      });
    },
    deleteUser(index) {
      this.$confirm('确定要删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 从用户列表中删除指定索引的用户
        this.users.splice(index, 1);
        this.$message.success('删除成功');
      }).catch(() => {});
    },
    async userInfo(){
      let result = await getUserInfo()
      if(result.code === 200){
        this.users = result.data
      }
    }
  },
  created(){
    this.userInfo()
  }
};
</script>

<style></style>