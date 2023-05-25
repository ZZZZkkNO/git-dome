import Vuex from 'vuex'
import Vue from 'vue'
import { car } from '@/api'
Vue.use(Vuex)

const actions = {
    permission(context, result){
        context.commit('PERMISSION', result)
    },
    async car(context){
        let result = await car()
        if(result.code === 200){
            context.commit('CAR', result.data)
        }
    },
    canusedParking(context, result){
        context.commit('CANUSEDPARKING', result)
    },
    selfparking(context, result){
        context.commit('SELFPARKING', result)
    }
}

const mutations = {
    PERMISSION(state, result){
        state.permission = result.permission
        state.carid = result.carid
        state.username = result.username
    },
    CAR(state, car){
        state.car = car
    },
    CANUSEDPARKING(state, num){
        state.canusedParking = num
    },
    SELFPARKING(state, selfParking){
        state.selfParking = selfParking.parkingid
    }
}

const state = {
    permission: "",
    car: [],
    carid: '',
    username: '',
    canusedParking: '',
    selfParking: '-'
}

const getters = {}


export default new Vuex.Store({
    actions,
    mutations,
    state,
    getters
})