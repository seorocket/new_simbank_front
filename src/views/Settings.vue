<template lang="pug">
  div
    q-card
      q-card-actions
        q-btn(
          :ripple="false"
          color="secondary"
          label="Добавить настройки Сервера"
          v-on:click="model.smb_server.data.length ? showNotify('top-right', 'У вас уже есть сервер', 'warning') : openPopup('create_server')"
          no-caps
        )
      q-separator
      q-card-section
        q-table(
          title="Сервер"
          :data="model.smb_server.data"
          :columns="columns_server"
          v-slot:body="props"
          :rows-per-page-options="[0]"
          row-key="name"
          hide-bottom
        )
          q-tr(:props="props")
            q-td(key="name" :props="props" v-html="props.row.name")
            q-td(key="server" :props="props" v-if="props.row.clo_server === true && props.row.status === false")
              q-spinner-gears(size="30px" style="margin-right: 15px")
              span {{ props.row.install_progress }}
            q-td(key="server" :props="props" v-html="props.row.server" v-else)
            q-td(key="datetime" :props="props" v-html="props.row.datetime")
            q-td(key="actions" :props="props" v-if="props.row.clo_server === true && props.row.status === true")
              q-btn(size="sm" round color="deep-orange" icon="delete" @click="deleteItem(props.row.id, 'smb_server')")
            q-td(key="actions" :props="props" v-else-if="props.row.clo_server === false")
              q-btn(
                size="sm"
                round color="secondary"
                icon="edit"
                style="margin-right: 10px;"
                v-on:click="openPopup('smb_server', props.row.id)"
                )
              q-btn(size="sm" round color="deep-orange" icon="delete" @click="deleteItem(props.row.id, 'smb_server')")
            q-td(v-else)
      q-separator
      q-card-actions
        q-btn(
          :ripple="false"
          color="secondary"
          label="Добавить настройки симбанка"
          no-caps
          v-on:click="model.smb_server.data.length ? openPopup('smb') : showNotify('top-right', `Создайте сервер для добавления настроек симбанка или GOIP шлюза`, 'warning')"
        )
      q-separator
      q-card-section
        q-table(
          title="Симбанк"
          :data="model.smb.data"
          :columns="columns_smb"
          v-slot:body="props"
          :rows-per-page-options="[0]"
          row-key="name"
          hide-bottom
        )
          q-tr(:props="props")
            q-td(key="name" :props="props" v-html="props.row.name")
            q-td(key="smb_id" :props="props" v-html="props.row.smb_id")
            q-td(key="smb_type" :props="props" v-html="props.row.smb_type")
            q-td(key="actions" :props="props")
              q-btn(size="sm" round color="deep-orange" icon="delete" @click="deleteItem(props.row.id, 'smb')")
      q-separator
      q-card-actions
        q-btn(
          :ripple="false"
          color="secondary"
          label="Добавить настройки GOIP"
          no-caps
          v-on:click="model.smb_server.data.length ? openPopup('gateway') : showNotify('top-right', `Создайте сервер для добавления настроек симбанка или GOIP шлюза`, 'warning')"
        )
      q-separator
      q-card-section
        q-table(
          title="Шлюз"
          :data="model.gateway.data"
          :columns="columns_gateway"
          v-slot:body="props"
          row-key="name"
          :rows-per-page-options="[0]"
          hide-bottom
        )
          q-tr(:props="props")
            q-td(key="name" :props="props" v-html="props.row.name")
            q-td(key="goip_id" :props="props" v-html="props.row.goip_id")
            q-td(key="goip_type" :props="props" v-html="props.row.goip_type")
            q-td(key="actions" :props="props")
              q-btn(size="sm" round color="deep-orange" icon="delete" @click="deleteItem(props.row.id, 'gateway')")
    <!-- popups -->
    q-dialog(
      v-model="popup.active"
      persistent
      )
      <!-- Шлюз -->
      PopupCreateUpdate(
        title="настройки GOIP шлюза"
        :submit="createObject"
        :data="popup.gateway"
        model="gateway"
        :settings="settings"
        @close="closePopup"
      )
      <!-- Симбанк -->
      PopupCreateUpdate(
        title="настройки Simbank"
        :submit="createObject"
        :data="popup.smb"
        model="smb"
        :settings="settings"
        @close="closePopup"
      )
      <!-- Сервер -->
      PopupCreateUpdate(
        title="настройки SMS сервера"
        :submit="createObject"
        :data="popup.smb_server"
        model="smb_server"
        :settings="settings"
        @close="closePopup"
      )
      PopupCreateSmsServer(
        title="Создание SMS сервера"
        :submit="actionRequest"
        :data="popup"
        model="create_server"
        @close="closePopup"
        open_socket="openSocket"
        close_socket="closeSocket"
      )
</template>

<script>
import mixins from "../plugins/general"
import PopupCreateUpdate from "../components/PopupCreateUpdate"
import PopupCreateSmsServer from "../components/PopupCreateSmsServer"
import {mapState} from "vuex";

export default {
  mixins: [mixins],
  components: {
    PopupCreateUpdate,
    PopupCreateSmsServer
  },
  computed: {
    ...mapState([
      'token',
    ])
  },
  data () {
    return {
      chat_socket: null,
      columns_server: [
        { name: 'name', align: 'left', label: 'Имя', field: 'name'},
        { name: 'server', label: 'Адрес', field: 'server', align: 'left'},
        { name: 'datetime', label: 'Дата создания', field: 'datetime', align: 'left'},
        { name: 'actions', label: 'Действия', align: 'left'}
      ],
      columns_smb: [
        { name: 'name', align: 'left', label: 'Имя', field: 'name'},
        { name: 'smb_id', label: 'ID', field: 'smb_id', align: 'left'},
        { name: 'smb_type', label: 'Тип', field: 'smb_type', align: 'left'},
        { name: 'actions', label: 'Действия', align: 'center'}
      ],
      columns_gateway: [
        { name: 'name', align: 'left', label: 'Имя', field: 'name'},
        { name: 'goip_id', label: 'ID', field: 'goip_id', align: 'left'},
        { name: 'goip_type', label: 'Тип', field: 'goip_type', align: 'left'},
        { name: 'actions', label: 'Действия', align: 'center'}
      ]
    }
  },
  methods: {
    openSocket() {
      const vm = this
      if (vm.chat_socket !== null) {
          return
      }
      console.log('open Socket')
      vm.chat_socket = new WebSocket(
          `${process.env.VUE_APP_ROOT_WS}/server_state/?token=${vm.token}`
      )

      vm.chat_socket.onmessage = function(e) {
        vm.model.smb_server.data = [JSON.parse(e.data).message]
        if (JSON.parse(e.data).message.status) {
          vm.closeSocket()
        }
      }

      vm.chat_socket.onclose = function() {
          console.log('Socket closed')
          vm.chat_socket = null
          if (!document.hidden) {
            console.log('socket reconnect in 5 sec')
            setTimeout(vm.openSocket, 5000)
          }
      }
    },
    closeSocket() {
      const vm = this
      if (vm.chat_socket.readyState === 1) {
          vm.chat_socket.close()
      }
    }
  },
  beforeMount () {
    this.getData('smb_server')
    this.getData('smb')
    this.getData('gateway')
  }
}
</script>

