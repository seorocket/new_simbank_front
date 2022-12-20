
<template lang="pug">
  div
    div(v-if="!token")
      q-dialog(
        v-model="dialog"
        persistent
        )
        q-card
          q-card-section(class="row items-center")
            span(class="q-ml-sm text-h6") Авторизация
          q-card-section(class="row items-center")
            form(@submit.prevent="authorization()" method="post" id="login" style="min-width: 400px")
              q-input(
                v-model="login.username"
                label="Логин"
                type="text"
                lazy-rules
                outlined
                stack-label
                style="width: 100%; margin-bottom: 10px"
              )
              q-input(
                outlined
                v-model="login.password"
                hint=""
                type="password"
                label="Пароль"
                stack-label
                style="width: 100%"
              )
              q-btn(
                flat
                label="Войти"
                color="primary"
                type="submit"
                )
              //q-btn(label="Зарегистрироваться" color="primary"  @click="popup.auth = false; popup.register = true")
              p(style="padding-top:21px; text-align:center")
                a(target="_blank" style="color:red; font-weight:bold; font-size:20px;"  href="https://simbank.pro/payment/") Страница оплаты
    q-layout(view="lHh lpR lff" v-else)
      q-header(elevated class="bg-primary text-white" height-hint="98")
        q-toolbar
          q-btn(dense flat round icon="menu" class="mobile-hide"  @click="$store.commit('turnLeftDrawer', 'miniStateDrawerL')")
          q-toolbar-title(style="text-align: center;") {{ $route.name }}
          q-icon(name="power_settings_new" @click="logOut()")
      q-drawer(show-if-above :mini="miniStateDrawerL" side="left" bordered )
        q-list
          q-item-label(header)
            img(src="https://simbank.pro/static/media/logo.3a24e86a.svg" style="display: table; margin: 0 auto;")
          LeftMenuLink(
            v-for="item in leftMenu"
            v-bind:icon="item.icon"
            v-bind:name="item.name"
            v-bind:link="item.link"
            v-bind:caption="item.caption"
            v-bind:css="item.css"
           )
      q-page-container(style="padding-right: 15px; margin-left: 15px; padding-top: 65px;")
        router-view
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import LeftMenuLink from '@/components/LeftMenuLink.vue'


export default {
  meta: {
    title: 'Simbank.pro'
  },
  components: {
    LeftMenuLink
  },
  data () {
    return {
      leftMenu: [
        {
          name: 'GOIP',
          caption: 'Channels',
          icon: 'goip.png',
          link: 'go-ip',
          css: ''
        },
        {
          name: 'SIM',
          caption: 'Список Sim-Карт',
          icon: 'sim.png',
          link: 'sim-list',
          css: 'padding: 0 5px;'
        },
        {
          name: 'SMS COLLECTOR',
          caption: 'Весь список СМС',
          icon: 'get_sms.png',
          link: 'sms-collector',
          css: 'padding-left: 15px;'
        },
        {
          name: 'SETTINGS',
          caption: 'Настройки',
          icon: 'simbank.png',
          link: 'settings',
          css: ''
        },
        {
          name: 'PROFILE',
          caption: 'Аккаунт',
          icon: 'user.png',
          link: 'profile',
          css: 'width: 80%;'
        },
      ],
      dialog: true,
      login: {
        username: '',
        password: ''
      }
    }
  },
  created () {
    axios.defaults.baseURL = 'http://127.0.0.1:8000/api'
    if (this.token) {
      axios.defaults.headers.common.Authorization = `Token ${this.token}`
    }

    axios.interceptors.response.use(
    (response) => {
      return {code: response.status, data: response.data, message: response.data.response_message}
    },
    (error) => {
      const vm = this
      if (error.response.status === 401) {
        vm.$store.dispatch('authorize', '')
      }
      return {code: error.response.status, data: error.response.data, message: error.response.data.response_message}
    })
  },
  computed: {
    ...mapState([
      'miniStateDrawerL',
      'miniStateDrawerR',
      'token',
      'states'
    ])
  },
  methods: {
    showNotify (position, message, color) {
      this.$q.notify({
        color: color,
        textColor: 'white',
        message: message,
        position: position,
        timeout: 0,
        actions: [
          { label: 'Скрыть', color: 'white', handler: () => { /* ... */ } }
        ]
      })
    },
    logOut () {
      const vm = this
      vm.$store.dispatch('authorize', '')
      location.reload()
    },
    authorization() {
      const vm = this
      axios.post('/authorize/', vm.login).then(response => {
        if (response.data.data && response.data.data.token) {
          axios.defaults.headers.common.Authorization = `Token ${response.data.data.token}`
          vm.login = {username: '', password: ''}
          this.$store.dispatch('authorize', response.data.data)
        } else {
          vm.showNotify('top-right', response.data.response_message, 'negative')
        }
      }).catch(error => {
        console.log(error)
        if (error.status >= 400) {
          vm.showNotify('top-right', error.data.response_message, 'negative')
        } else {
          vm.showNotify('top-right', 'ошибка авторизации', 'negative')
        }
      })
    }
  },
 beforeMount () {
    // let vm = this
 }
}
</script>

<style>
  .q-tooltip--style{
    font-size: 14px!important;
  }
</style>
