<template>
    <div class="login-page">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="login-title">🔐后台管理系统</span>
          </div>
          <div class="login-form">
            <el-form :model="form" :rules="loginRules" ref="loginForm">
              <el-form-item prop="userName">
                <el-input type="text" v-model="form.username" auto-complete="off" placeholder="请输入用户名">
                  <template slot="prepend"><i style="font-size:20px" class="el-icon-user"></i></template>
                </el-input>
              </el-form-item>
              <el-form-item prop="passWord">
                <el-input type="text" v-model="form.password" auto-complete="off" placeholder="请输入密码">
                  <template slot="prepend"><i style="font-size:20px" class="el-icon-key"></i></template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button style="width:100%;" type="primary" @click="login" :loading="loading">登录</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
</template>

<script>
import {login, checkLoginState} from '@/api'
export default {
    data(){
        return {
            loading: false,
            form:{
                username: '',
                password: ''
            },
            loginRules:{
                userName: [
                { required: true, message: '请输入账户', trigger: 'blur' },
                ],
                passWord: [
                { required: true, message: '请输入密码', trigger: 'blur'}
                ]
            }
        }
    },
    methods:{
        async login(){
             this.loading = true
             const result = await login(JSON.stringify(this.form))
             if(result.success){
                  localStorage.setItem('token', result.token)
                  this.$store.dispatch('permission', result.data[0])
                  this.loading = false
                  this.$router.push('/main')
             }else{
                this.loading = false
                this.$message({
                message: '输入错误！',
                type: 'warning'
                })
            }
        },
        async checkLogin(){
            if(localStorage.getItem('token') == null) return
            let result = await checkLoginState()
            if(result.code === 200){
                this.$router.push('/main')
            }
        }
    },
    created(){
        this.checkLogin()
    }
}
</script>

<style scoped>
.login-page{
    background-image: linear-gradient(180deg, #2af598 0%, #009efd 100%);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .login-title{
    font-size: 20px;
  }
  
  .box-card {
    width: 375px;
  }
</style>