import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const adminToken = 'adminToken'
const adminInfo = 'adminInfo'

export default new Vuex.Store({
  state: {
    adminToken: localStorage.getItem(adminToken) || '',
    adminInfo: JSON.parse(localStorage.getItem(adminInfo)) || {}
  },
  getters: {
    username: state => state.adminInfo.username,
    role: state => state.adminInfo.role
  },
  mutations: {
    updateToken (state, newToken) {
      state.adminToken = newToken
      localStorage.setItem(adminToken, newToken)
    },
    updateAdminInfo (state, newInfo) {
      state.adminInfo = newInfo
      localStorage.setItem(adminInfo, JSON.stringify(newInfo))
    },
    removeToken (state) {
      state.adminToken = ''
      localStorage.removeItem(adminToken)
    },
    removeAdminInfo (state) {
      state.adminInfo = {}
      localStorage.removeItem(adminInfo)
    }
  },
  actions: {
  },
  modules: {
  }
})
