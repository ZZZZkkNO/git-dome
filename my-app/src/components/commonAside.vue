<template>
    <div>
        <el-menu default-active="1-4-1" class="el-menu-vertical-demo" :collapse="isCollapse"  background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <h1>停车管理系统</h1>
            <el-menu-item index="1">
                <i class="el-icon-s-home"></i>
                <span @click="goMain">首页</span>
            </el-menu-item>
            <el-menu-item index="2" v-if="permission === 'admin'">
                <i class="el-icon-s-custom"></i>
                <span @click="goUser">用户管理</span>
            </el-menu-item>
            <el-menu-item index="3">
                <i class="el-icon-menu"></i>
                <span @click="goHome">车辆管理</span>
            </el-menu-item>
            <el-menu-item index="4">
                <i class="el-icon-document"></i>
                <span @click="goParking">车位管理</span>
            </el-menu-item>
            <el-menu-item index="5">
                <i class="el-icon-more-outline"></i>
                <span>查看更多</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
export default {
    zdata() {
      return {
        isCollapse: false,
        permission: this.$store.state.permission
      };
    },
    methods:{
        goUser(){
            this.$router.push('/main/user')
        },
        goHome(){
            this.$router.push('/main/home')
        },
        goParking(){
            this.$router.push('/main/parking')
        },
        goMain(){
            this.$router.push('/main')
        }
    }
  }
</script>

<style scoped>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 199px;
        min-height: 720px;
        text-align: center;
    }
</style>