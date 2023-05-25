<template>
    <div>
        <el-table :data="tableData">
            <el-table-column prop="parkingid" label="车位号" width="300">
            </el-table-column>
            <el-table-column prop="status" label="车位状态" >
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="200">
                <template slot-scope="scope" >
                <el-button
                    size="mini"
                    @click="handleAppoint(scope.$index, scope.row)">预约</el-button>
                    <el-button
                    size="mini"
                    @click="handleDelete(scope.$index, scope.row)" v-show="permission == 'admin'">移除</el-button>
                </template>             
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { getParkingInfo, reservationOfParking } from '@/api'
export default {
    data(){
        return {
            tableData:[],
            permission: this.$store.state.permission
        }   
    },
    methods:{
        open() {
        this.$message.error('该车位已经被预约或您已预约车位');
        },
        async handleAppoint(index, row){
            if(row.status !== '空闲'){
                this.open()
                return
            }
            let result = await reservationOfParking({parkingid: row.parkingid, username: this.$store.state.username})
            if(result.code === 403){
                this.open()
            }else{
                this.parkingInfo()
            } 
        },

        async parkingInfo(){
            let result = await getParkingInfo()
            if(result.code === 200){
                this.tableData = result.data[0]
                this.$store.dispatch('canusedParking', result.data[1])
            }
        }
    },
    created(){
        this.parkingInfo()
    }
}
    
</script>

<style>

</style>