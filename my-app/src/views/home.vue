<template>
    <div>
        <el-table :data="car">
            <el-table-column prop="startdate" label="起始日期" width="200">
            </el-table-column>
            <el-table-column prop="carid" label="车牌" width="180">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope" >
                  <el-button
                    size="mini"
                    @click="handlePayMoney(scope.$index, scope.row)">结算</el-button>
                </template>
              </el-table-column>
          </el-table>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import socket from '@/socket'
export default {
    data(){
        return {
        }
    },
    methods:{
        handlePayMoney(index, row){
            let nowTime = Date.now()
            console.log(nowTime)
            let startTime = new Date(row.startdate).getTime()
            console.log(startTime)
            let usedTime = nowTime - startTime
            let days = Math.floor(usedTime / (24 * 3600 * 1000));
            let leave1 = usedTime % (24 * 3600 * 1000);  
            let hours = Math.floor(leave1 / (3600 * 1000));
            let leave2 = leave1 % (3600 * 1000);        
            let minutes = Math.floor(leave2 / (60 * 1000));
            let time = days + "天" + hours + "时" + minutes + "分";
            this.open(time)
        },
        open(str) {
            this.$alert(`停车时间为${str}`, '结算', {
            confirmButtonText: '确定',
            callback: action => {
                this.$message({
                type: 'info',
                message: `action: ${ action }`
                });
            }
            });
        }
    },
    computed:{
        ...mapState({
            car: (state) => state.car
        })
    },
    created(){
        this.$store.dispatch('car')
        socket.on('parkingChange', ()=> {
            console.log('收到车位更新信息')
            this.$store.dispatch('car')
        })
    }
}
</script>

<style>

</style>