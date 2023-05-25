import Vue from 'vue'
import VueRouter from 'vue-router'
import main from '../views/main.vue'
import home from '../views/home.vue'
import users from '../views/user.vue'
import parking from '@/views/parking.vue'
import login from '@/views/login.vue'
import store from '@/store'
Vue.use(VueRouter)

let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace

VueRouter.prototype.push = function(location, resolve, reject){
    if(resolve && reject){
        originPush.call(this, location, resolve, reject)
    }else{
        originPush.call(this, location, ()=>{}, ()=>{})
    }
}
VueRouter.prototype.replace = function(location, resolve, reject){
    if(resolve && reject){
        originReplace.call(this, location, resolve, reject)
    }else{
        originReplace.call(this, location, ()=>{}, ()=>{})
    }
}


const routes =[
    { 
        path: '/main',
        component: main,
        meta: {isShow: true},
        children: [
            {
                path: 'home',
                component: home,

            },
            {
                path: 'user',
                component: users,
                meta: {isShow: false}
            },
            {
                path: 'parking',
                component: parking,
                meta: {isShow: false}
            }
        ]
    },
    {
        path: '/login',
        component: login
    },
    {
        path: '/',
        redirect: '/login'
    }
]
const router = new VueRouter({
    routes
})

// router.beforeEach((to, from, next) => {
//     if(to.path === '/login'){
//         if(store.state.permission !== ''){
//             next({path: '/main'})
//         }else{
//             next()
//         }
//     }
//     if(to.path === '/main'){
//         if(store.state.permission === ''){
//             next({path: '/login'})
//         }
//         next()
//     }
//     if(to.path === '/main/user'){
//         if(store.state.permission === ''){
//             next({path: '/login'})
//         }
//         if(store.state.permission === 'admin'){
//             next()
//         }
//     }
//     if(to.path === '/main/parking'){
//         if(store.state.permission === ''){
//             next({path: '/login'})
//         }   
//         next()
//     }
//     if(to.path === '/main/home'){
//         if(store.state.permission === ''){
//             next({path: '/login'})
//         }   
//         next()
//     }
// })

export default router
