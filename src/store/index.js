import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    miniStateDrawerL: false,
    miniStateDrawerR: true,
    token: undefined,
    states: {
      servers: [],
      smbs: [],
      goips: []
    }
  },
  mutations: {
    turnLeftDrawer (state, item) {
      state[item] = !state[item]
    },
    authorize (state, data) {
      state.token = data
    },
    setStates (state, data) {
      state.states = {...state.states, ...data} 
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
