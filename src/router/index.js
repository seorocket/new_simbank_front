import Vue from 'vue'
import VueRouter from 'vue-router'
import Goip from '../views/Goip.vue'
import Sim from '../views/Sim.vue'
import Employees from '../views/Employees.vue'
import Settings from '../views/Settings.vue'
import SmsCollector from '../views/SmsCollector.vue'
import CallCollector from '../views/CallCollector.vue'
import Transactions from '../views/Transactions.vue'
import SuccessRegistration from '../views/SuccessRegistration.vue'
import FailRegistration from '../views/FailRegistration.vue'
import TopUpBalance from '../views/TopUpBalance.vue'
import SuccessPayment from '../views/SuccessPayment.vue'
import FailurePayment from '../views/FailPayment.vue'
import Support from '../views/Support.vue'
import SupportDetail from '../views/SupportDetail.vue'
import ApiDocumentation from '../views/ApiDocumentation'
import store from '../store/index.js'


Vue.use(VueRouter)

const routes = [
  {
    path: '',
    name: 'GOIP',
    caption: 'Линии',
    icon: 'settings_input_antenna',
    css: '',
    show: false,
    meta: {
      roles: ['all'],
    },
    component: Goip
  },
  {
    path: '/go-ip',
    name: 'GOIP',
    caption: 'Линии',
    icon: 'settings_input_antenna',
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
    icon: 'sim_card',
    css: 'padding: 0 5px;',
    show: true,
    meta: {
      roles: ['owner', 'employee'],
    },
    component: Sim
  },
  {
    path: '/sms-collector',
    name: 'SMS COLLECTOR',
    caption: 'Весь список СМС',
    icon: 'chat',
    show: true,
    meta: {
      roles: ['owner', 'employee'],
    },
    component: SmsCollector
  },
  {
    path: '/call-collector',
    name: 'CALL COLLECTOR',
    caption: 'Cписок входящих звонков',
    icon: 'phone_callback',
    show: true,
    meta: {
      roles: ['owner', 'employee'],
    },
    component: CallCollector
  },
  {
    path: '/settings',
    name: 'SETTINGS',
    caption: 'Настройки',
    icon: 'settings',
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
    icon: 'group',
    show: true,
    meta: {
      roles: ['owner'],
    },
    component: Employees
  },
  {
    path: '/transactions',
    name: 'TRANSACTIONS',
    caption: 'Операции по балансу',
    icon: 'price_check',
    show: true,
    meta: {
      roles: ['owner'],
    },
    component: Transactions
  },
  {
    path: '/support',
    name: 'SUPPORT',
    caption: 'Техподдержка',
    icon: 'support',
    show: true,
    meta: {
      roles: ['owner', 'employee'],
    },
    component: Support
  },
  {
    path: '/support/:id',
    name: 'Диалог с техподдержкой',
    caption: 'Техподдержка',
    icon: 'support',
    show: false,
    meta: {
      roles: ['owner', 'employee'],
    },
    component: SupportDetail
  },
  {
    path: '/top-up-balance',
    name: 'TOP UP',
    caption: 'Пополнение баланса',
    icon: 'payments',
    show: true,
    meta: {
      roles: ['all'],
    },
    component: TopUpBalance
  },
  {
    path: '/success-registration',
    name: 'success',
    caption: 'Успешная регистрация',
    icon: '',
    css: '',
    show: false,
    meta: {
      roles: ['all'],
      for_all: true
    },
    component: SuccessRegistration
  },
  {
    path: '/fail-registration',
    name: 'fail',
    caption: 'Ошибка при регистрации',
    icon: '',
    css: '',
    show: false,
    meta: {
      roles: ['all'],
      for_all: true
    },
    component: FailRegistration
  },
  {
    path: '/failure-payment',
    name: 'failure-payment',
    caption: 'Ошибка при пополнение баланса',
    icon: '',
    css: '',
    show: false,
    meta: {
      roles: ['all'],
      for_all: true
    },
    component: FailurePayment
  },
  {
    path: '/success-payment',
    name: 'success-payment',
    caption: 'Успешная оплата',
    icon: '',
    css: '',
    show: false,
    meta: {
      roles: ['all'],
      for_all: true
    },
    component: SuccessPayment
  },
  {
    path: '/api-documentation',
    name: 'API',
    caption: 'Документация',
    icon: 'article',
    css: '',
    show: true,
    meta: {
      roles: ['all'],
    },
    component: ApiDocumentation
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})
router.beforeEach((to, from, next) => {
  if (to.meta.roles.includes('all') || to.meta.roles.includes(store.state.user.role) || !Object.keys(store.state.user).length) {
    next()
  } else {
    next({'path': '/'})
  }
})
export default router
