import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    miniStateDrawerL: false,
    miniStateDrawerR: true,
    token: undefined,
    user_id: undefined,
    user: {}
  },
  mutations: {
    turnLeftDrawer (state, item) {
      state[item] = !state[item]
    },
    authorize (state, data) {
      state.token = data.token
      state.user_id = data.user_id
    },
    user (state, data) {
      state.user = data
    },
    setStates (state, data) {
      state.states = {...state.states, ...data} 
    }
  },
  actions: {
    authorize({ commit }, data) {
      commit('authorize', data)
    },
    user({ commit }, data) {
      commit('user', data)
    }
  },
  modules: {
  },
  plugins: [createPersistedState()]
})

export default store