import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    miniStateDrawer: false,
    token: undefined,
  },
  mutations: {
    turnLeftDrawer (state) {
      state.miniStateDrawer = !state.miniStateDrawer
    },
    authorize (state, data) {
      state.token = data
    }
  },
  actions: {
    authorize({ commit }, str) {
      commit('authorize', str)
    }
  },
  modules: {
  },
  plugins: [createPersistedState()]
})
