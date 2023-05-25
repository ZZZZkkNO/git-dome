<template>
    <div>
      <el-row :gutter="20">
        <el-col :span="6">
            <el-statistic title="总车位">
                <template slot="formatter"> 9 </template>
            </el-statistic>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic title="剩余车位数量">
              <template slot="formatter"> {{ canUsedParking }} </template>
            </el-statistic>
          </div>
        </el-col> 
        <el-col :span="6">
            <div>
                <el-statistic title="车牌">
                  <template slot="formatter"> {{carid}}  </template>
                </el-statistic>
            </div>
        </el-col>
        <el-col :span="6">
            <div>
                <el-statistic title="车位">
                  <template slot="formatter"> {{selfParking }} </template>
                </el-statistic>
            </div>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
import { mapState } from 'vuex';
    export default  {
      data() {
        return {
        };
      },
      computed: {
        ...mapState({
          carid: (state) => state.carid,
          canUsedParking:(state) => state.canusedParking,
          selfParking: state => state.selfParking
        })
      }
    };
  </script>
  <style scoped>
    .like {
      cursor: pointer;
      font-size: 25px;
      display: inline-block;
    }
  </style>