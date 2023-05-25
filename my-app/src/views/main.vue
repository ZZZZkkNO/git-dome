<template>
   <div>
    <el-container>
        <el-aside width="200px">
            <commonAside></commonAside>
        </el-aside>
        <el-container>
          <el-header>
            <Footer></Footer>
          </el-header>
          <el-main>
                <total v-show="$route.meta.isShow"></total>
                <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
   </div>
</template>

<script>
    import commonAside from '@/components/commonAside.vue';
    import Footer from '@/components/footer.vue';
    import total from '@/components/total.vue';
    import { getParkingInfo, getSelfParking } from '@/api';
import { mapState } from 'vuex';
    export default {
        components: {commonAside, Footer, total},
        data() {
            return {};
        },
        methods: {
            async getParkingNum(){
                let result = await getParkingInfo()
                if(result.code === 200){
                    this.$store.dispatch('canusedParking', result.data[1])
                }
            },
            async selfParking(){
                let result = await getSelfParking({username: this.$store.state.username})
                if(result.code === 200){
                    this.$store.dispatch('selfparking', result.data)
                }
            }
        },
        created(){
            this.getParkingNum()
            this. selfParking()
        }
    };
</script>

<style scoped>
    .el-header{
        padding-left: 0px;
    }
</style>