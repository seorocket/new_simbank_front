
<template lang="pug">
  div
    div(v-if="$route.meta.for_all")
      router-view
    div(v-else-if="!token")
      q-dialog(
        v-model="dialog"
        persistent
        )
        q-card
          q-tabs(
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          )
            q-tab(name="authorization" label="Авторизация" class="q-py-md")
            q-tab(name="registration" label="Регистрация" class="q-py-md")

          q-tab-panels(v-model="tab")
            q-tab-panel(name="authorization")
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
                  //div(
                  //  style="margin: -15px 0 10px 0"
                  //)
                  //  router-link(:to="{name: 'Reset password'}" style="text-decoration: none;")
                  //    a(
                  //      href="#"
                  //      style="color: var(--q-color-primary) !important; text-decoration: none;"
                  //    ) Забыли пароль?
                  q-btn(
                    label="Войти"
                    color="primary"
                    type="submit"
                    style="margin-right: 10px;"
                  )
                  router-link(:to="{name: 'top-up-balance'}" class="router-link-active")
                    q-btn(
                      label="Пополнить баланс"
                      color="primary"
                      type="submit"
                      )
                  div(
                    style="margin: 15px 0 10px 0"
                  )
                    span Это новая версия simbank.pro
                    br
                    span чтобы переидти на старую нажмите на
                    a(
                      href="https://old.simbank.pro"
                      style="color: var(--q-color-primary) !important; text-decoration: none; margin-left: 5px;"
                    ) ссылку
            q-tab-panel(name="registration")
              q-card-section(class="row items-center")
                form(@submit.prevent="registration()" method="post" id="login" style="min-width: 400px")
                  q-input(
                    v-model="registration_data.username"
                    label="Логин"
                    type="text"
                    lazy-rules
                    outlined
                    stack-label
                    style="width: 100%; margin-bottom: 10px"
                  )
                  q-input(
                    v-model="registration_data.email"
                    label="Почта"
                    type="text"
                    lazy-rules
                    outlined
                    stack-label
                    style="width: 100%; margin-bottom: 10px"
                  )
                  q-input(
                    outlined
                    v-model="registration_data.password"
                    hint=""
                    type="password"
                    label="Пароль"
                    stack-label
                    style="width: 100%"
                  )
                  q-input(
                    outlined
                    v-model="registration_data.require_password"
                    hint=""
                    type="password"
                    label="Подтвердите пароль"
                    stack-label
                    style="width: 100%"
                  )
                  q-btn(
                    label="Регистрация"
                    color="primary"
                    type="submit"
                    )
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
            v-if="item.show && (item.meta.roles.includes(user.role) || item.meta.roles.includes('all'))"
            v-bind:icon="item.icon"
            v-bind:name="item.name"
            v-bind:link="item.path"
            v-bind:caption="item.caption"
            v-bind:css="item.css"
           )
          q-item
            q-item-section
              q-item-label Аккаунт
              q-item-label(caption) {{ user.username }}
          q-item(v-if="user.role === 'owner'")
            q-item-section
              q-item-label Баланс
              q-item-label(caption) {{ user.balance }} руб.
      q-page-container(style="padding-right: 15px; margin-left: 15px; padding-top: 65px;")
        router-view
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import LeftMenuLink from '@/components/LeftMenuLink.vue'
import mixins from "@/plugins/general";
import routes from "./router/index.js"


export default {
  mixins: [mixins],
  meta: {
    title: 'Simbank.pro'
  },
  components: {
    LeftMenuLink
  },
  data () {
    return {
      tab: 'authorization',
      leftMenu: routes.options.routes,
      dialog: true,
      login: {
        username: '',
        password: '',
      },
      registration_data: {
        username: '',
        email: '',
        password: '',
        require_password: ''
      }
    }
  },
  created () {
    console.log(process.env.VUE_APP_ROOT_API)
    axios.defaults.baseURL = process.env.VUE_APP_ROOT_API
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
        delete axios.defaults.headers.common["Authorization"]
        vm.showNotify('top-right', error.response.data.response_message, 'negative')
      }
      console.log(error.response)
      return {code: error.response.status, data: error.response.data, message: error.response.data.response_message}
    })
  },
  computed: {
    ...mapState([
      'miniStateDrawerL',
      'miniStateDrawerR',
      'token',
      'user_id',
      'states',
      'user'
    ])
  },
  methods: {
    logOut () {
      const vm = this
      vm.$store.dispatch('authorize', '')
      vm.$store.dispatch('user', {})
    },
    authorization() {
      const vm = this
      axios.post('/authorize/', vm.login).then(response => {
        if (response.data.data && response.data.data.token) {
          axios.defaults.headers.common.Authorization = `Token ${response.data.data.token}`
          vm.login = {username: '', password: ''}
          vm.$store.dispatch('authorize', response.data.data)
          axios.get(`/clients/${vm.user_id}/`).then(response => {
            if (typeof(response.data) == 'object' && response.code === 200) {
              vm.$store.dispatch('user', response.data)
            }
          })
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
    },
    registration() {
      const vm = this
      if (vm.registration_data.username.length < 4) {
        vm.showNotify('top-right', 'Минимальная длина логина 4 символа', 'negative')
        return
      }
      if (!vm.registration_data.email) {
        vm.showNotify('top-right', 'Укажите Email', 'negative')
        return
      }
      if (!vm.check_email(vm.registration_data.email)) {
        vm.showNotify('top-right', 'Введенный Email не валиден', 'negative')
        return
      }
      if (vm.registration_data.password.length < 3) {
        vm.showNotify('top-right', 'Минимальная длинна пароля 8 символов', 'negative')
        return
      }
      if (vm.registration_data.password !== vm.registration_data.require_password) {
        vm.showNotify('top-right', 'Пароли не совпадают', 'negative')
        return
      }
      axios.post('/registration/', vm.registration_data).then(response => {
          if (response.code === 200) {
            vm.showNotify('top-right', response.data.response_message, 'positive')
            vm.tab = 'authorization'
            vm.registration_data = {
              username: '',
              password: '',
              require_password: ''
            }
          } else {
            vm.showNotify('top-right', response.message, 'negative')
          }
      })
    },
    check_email(email){
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    }
  },
  mounted () {
    let vm = this
    if (vm.user_id) {
      axios.get(`/clients/${vm.user_id}/`).then(response => {
        if (typeof(response.data) == 'object' && response.code === 200) {
          vm.$store.dispatch('user', response.data)
        }
      })
    }
  }
}
</script>

<style>
  .router-link-active {
    text-decoration: none;
  }
  .q-tooltip--style{
    font-size: 14px!important;
  }
</style>
