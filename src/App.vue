
<template lang="pug">
  div
    q-layout(view="lHh lpR lff")
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
      q-page-container(style="padding-right: 15px;")
        router-view
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import LeftMenuLink from '@/components/LeftMenuLink.vue'
import Vue from "vue";

let Requests = axios.create({
  baseURL: "https://simbank.pro/api",
});

Requests.interceptors.response.use(
(response) => {
  return {code: response.status, data: response.data}
},
(error) => {
  return {code: error.response.status, data: error.response.data}
});


Vue.prototype.$http = Requests

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
      ]
    }
  },
  created () {
    this.$http.get('/').then(response => {
        console.log(response)
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
