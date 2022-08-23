import Vue from 'vue'
import VueRouter from 'vue-router'
import Goip from '../views/Goip.vue'
import Sim from '../views/Sim.vue'
import Simbank from '../views/Simbank.vue'
import Getsms from '../views/Getsms.vue'
import Settings from '../views/Settings.vue'
import SmsCollector from '../views/SmsCollector.vue'
import CallCollector from '../views/CallCollector.vue'
import GetApi from '../views/GetApi.vue'
import Cabinet from '../views/Cabinet.vue'
import GetFaq from '../views/GetFaq.vue'
import GetHistory from '../views/GetHistory.vue'
import GetTelegram from '../views/GetTelegram.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
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
    path: '/get-api',
    name: 'Get API',
    icon: 'source',
    text: 'Get API',
    show: true,
    component: GetApi
  },
  {
    path: '/get-history',
    name: 'Get History',
    icon: 'source',
    text: 'Get History',
    show: true,
    component: GetHistory
  },
  {
    path: '/get-telegram',
    name: 'Get Telegram',
    icon: 'source',
    text: 'Get Telegram',
    show: true,
    component: GetTelegram
  },
  {
    path: '/get-faq',
    name: 'Get FAQ',
    icon: 'source',
    text: 'Get FAQ',
    show: true,
    component: GetFaq
  },
  {
    path: '/get-cabinet',
    name: 'Cabinet',
    icon: 'source',
    text: 'Cabinet',
    show: true,
    component: Cabinet
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
    path: '/call-collector',
    name: 'CALL COLLECTOR',
    icon: 'source',
    text: 'CALL COLLECTOR',
    show: true,
    component: CallCollector
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
router.beforeEach((to, from, next) => {
   if(to.name != 'Get SMS' || to.name != 'Main'){
     clearInterval(window.timeout);
   }
   next()
})
export default router
