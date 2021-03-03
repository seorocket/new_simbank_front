import Vue from 'vue'
import VueRouter from 'vue-router'
import Goip from '../views/Goip.vue'
import Sim from '../views/Sim.vue'
import Simbank from '../views/Simbank.vue'
import Getsms from '../views/Getsms.vue'
import Settings from '../views/Settings.vue'
import SmsCollector from '../views/SmsCollector.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/go-ip',
    name: 'Main',
    icon: 'source',
    text: 'GOIP',
    show: true,
    component: Goip
  },
  {
    path: '/sim-list',
    name: 'Sim',
    icon: 'source',
    text: 'SIM',
    show: true,
    component: Sim
  },
  {
    path: '/simbank',
    name: 'Simbank',
    icon: 'source',
    text: 'SIMBANK',
    show: true,
    component: Simbank
  },
  {
    path: '/get-sms',
    name: 'Get SMS',
    icon: 'source',
    text: 'Get SMS',
    show: true,
    component: Getsms
  },
  {
    path: '/sms-collector',
    name: 'SMS COLLECTOR',
    icon: 'source',
    text: 'SMS COLLECTOR',
    show: true,
    component: SmsCollector
  },
  {
    path: '/settings',
    name: 'Настройки',
    icon: 'source',
    text: 'SETTINGS',
    show: true,
    component: Settings
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
