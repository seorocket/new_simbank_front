import Vue from 'vue'
import VueRouter from 'vue-router'
import Goip from '../views/Goip.vue'
import Sim from '../views/Sim.vue'
import Employees from '../views/Employees.vue'
import Settings from '../views/Settings.vue'
import SmsCollector from '../views/SmsCollector.vue'
import CallCollector from '../views/CallCollector.vue'
import GetApi from '../views/GetApi.vue'
import GetFaq from '../views/GetFaq.vue'
import store from '../store/index.js'


Vue.use(VueRouter)

const routes = [
  {
    path: '',
    name: 'GOIP',
    caption: 'Channels',
    icon: 'goip.png',
    css: '',
    show: false,
    meta: {
      roles: ['owner', 'employee'],
    },
    component: Goip
  },
  {
    path: '/go-ip',
    name: 'GOIP',
    caption: 'Channels',
    icon: 'goip.png',
    css: '',
    show: true,
    meta: {
      roles: ['owner', 'employee'],
    },
    component: Goip
  },
  {
    path: '/sim-list',
    name: 'SIM',
    caption: 'Список Sim-Карт',
    icon: 'sim.png',
    css: 'padding: 0 5px;',
    show: true,
    meta: {
      roles: ['owner', 'employee'],
    },
    component: Sim
  },
  {
    path: '/get-api',
    name: 'Get API',
    icon: 'source',
    show: false,
    meta: {
      roles: ['owner'],
    },
    component: GetApi
  },
  {
    path: '/get-faq',
    name: 'Get FAQ',
    icon: 'source',
    show: false,
    meta: {
      roles: ['owner', 'employee'],
    },
    component: GetFaq
  },
  {
    path: '/sms-collector',
    name: 'SMS COLLECTOR',
    caption: 'Весь список СМС',
    icon: 'get_sms.png',
    css: 'padding-left: 15px;',
    show: true,
    meta: {
      roles: ['owner', 'employee'],
    },
    component: SmsCollector
  },
  {
    path: '/call-collector',
    name: 'CALL COLLECTOR',
    icon: 'source',
    show: false,
    meta: {
      roles: ['owner', 'employee'],
    },
    component: CallCollector
  },
  {
    path: '/settings',
    name: 'SETTINGS',
    caption: 'Настройки',
    icon: 'simbank.png',
    show: true,
    meta: {
      roles: ['owner'],
    },
    component: Settings
  },
  {
    path: '/employess',
    name: 'EMPLOYEES',
    caption: 'Сотрудники',
    icon: 'user.png',
    css: 'width: 80%;',
    show: true,
    meta: {
      roles: ['owner'],
    },
    component: Employees
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})
router.beforeEach((to, from, next) => {
  console.log(store.state.user)
  if (to.meta.roles.includes(store.state.user.role) || !Object.keys(store.state.user).length) {
    next()
  } else {
    next({'path': '/'})
  }
})
export default router
