import Vue from 'vue'
import mixins from './plugins/general'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './quasar'

Vue.config.productionTip = false

new Vue({
  mixins: [mixins],
  router,
  store,
  render: h => h(App)
}).$mount('#app')
