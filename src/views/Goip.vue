<template lang="pug">
  div
    q-card
      q-card-actions
        q-card-section(style="width: 100%")
          q-table(
            :data="model.gateway_lines.data"
            :columns="columns"
            v-slot:body="props"
            hide-bottom
            :rows-per-page-options="[0]"
          )
            q-tr
              q-td(key="line_id" :props="props") {{ props.row.line_id }}
              q-td(key="login" :props="props")
                div.green_circle(v-if="props.row.login === 'ONLINE' || props.row.login === 'IDLE'")
                div.red_circle(v-else)
              q-td(key="gsm_status" :props="props")
                div.green_circle(v-if="props.row.gsm_status === 'LOGIN'")
                div.red_circle(v-else)
              q-td(key="phone_number" :props="props")
                template(v-if="props.row.phone_number")
                  | {{ props.row.operator }} / {{ props.row.phone_number }}
              q-td(key="signal" :props="props") {{ props.row.signal }}
              q-td(key="sim_id" :props="props" v-html="props.row.sim_id ? props.row.sim_id : '-'")
              q-td(key="imei" :props="props") {{ props.row.imei }}
              q-td(key="action" :props="props")
                q-btn(
                  v-if="props.row.id"
                  size="xs"
                  color="secondary"
                  label="Отправить СМС"
                  style="margin-right: 10px;"
                  @click="openSendSms('send_sms', {line: props.row.line_id, id: props.row.id})"
                )
                q-btn(
                  v-if="props.row.id"
                  size="xs"
                  color="secondary"
                  label="USSD"
                  style="margin-right: 10px;"
                  @click="openSendUssd('send_ussd', {line: props.row.line_id, sim: props.row.id})"
                )
                q-btn(
                  v-if="props.row.id"
                  size="xs"
                  color="secondary"
                  label="Отключить"
                  style="margin-right: 10px;"
                  @click="removeSIM(props.row.id)"
                )
    <!-- popups -->
    q-dialog(
      v-model="popup.active"
      persistent
      )
      <!-- send USSD -->
      PopupSendUssd(
        title="Отправить USSD"
        :submit="actionRequest"
        :data="popup.send_ussd"
        model="send_ussd"
        :settings="settings"
        @close="closePopup"
      )
      PopupSendSms(
        title="Отправить СМС"
        :submit="actionRequest"
        :data="popup.send_sms"
        model="send_sms"
        :settings="settings"
        @close="closePopup"
      )
</template>

<script>
import mixins from "../plugins/general";
import PopupSendUssd from "../components/PopupSendUssd";
import PopupSendSms from "../components/PopupSendSms";
import {mapState} from "vuex";

export default {
  mixins: [mixins],
  components: {
    PopupSendUssd,
    PopupSendSms
  },
  meta: {
    title: 'GOIP - Линии'
  },
  computed: {
    ...mapState([
      'token',
    ])
  },
  data () {
    return {
      submitting: false,
      chat_socket: null,
      poll_interval: '',
      columns: [
        {
          name: 'line_id',
          label: 'ID линии',
          align: 'center',
          field: 'line_id',
          headerStyle: 'width: 5%'
        },
        {
          name: 'login',
          label: 'Авторизация',
          align: 'center',
          field: 'login',
          headerStyle: 'width: 5%'
        },
        {
          name: 'gsm_status',
          label: 'GSM Статус',
          align: 'center',
          field: 'gsm_status',
          headerStyle: 'width: 5%'
        },
        {
          name: 'phone_number',
          label: 'Оператор / Номер',
          align: 'center',
          field: 'phone_number',
          headerStyle: 'width: 20%'
        },
        {
          name: 'signal',
          label: 'Сигнал',
          align: 'center',
          field: 'signal',
          headerStyle: 'width: 5%'
        },
        {
          name: 'sim_id',
          label: 'SIM ID',
          align: 'center',
          field: 'sim_id',
          headerStyle: 'width: 5%'
        },
        {
          name: 'imei',
          label: 'IMEI',
          align: 'center',
          field: 'imei',
          headerStyle: 'width: 15%'
        },
        {
          name: 'action',
          label: 'Действия',
          align: 'center',
          headerStyle: 'width: 40%'
        }
      ]
    }
  },
  methods: {
    removeSIM (sim) {
      const vm = this
      vm.actionRequest(`/sim/${sim}/activate_sim/`, {}, '', 'gateway_lines')
      // костыль, чтобы избежать косяков из кеша
      clearInterval(vm.poll_interval)
      setTimeout(function () {
        vm.poll_interval = setInterval(function(){
            vm.chat_socket.send(JSON.stringify({
                'message': 'get_data'
            }));
        }, 10000)
      }, 10000)
    },
    openSendUssd (type, data) {
      const vm = this
      vm.getData('gateway_lines')
      vm.popup.active = vm.popup[type].active = true
      vm.popup[type].scheme.line_id.value = data.line
      vm.popup[type].scheme.sim.value = data.sim
    },
    openSendSms (type, data) {
      const vm = this
      vm.getData('gateway_lines')
      vm.popup.active = vm.popup[type].active = true
      vm.popup[type].scheme.line_id.value = data.line
      vm.popup[type].scheme.sim.value = data.id
    },
    openSocket() {
      const vm = this
      if (vm.chat_socket !== null) {
          return
      }
      console.log('open Socket')
      vm.chat_socket = new WebSocket(
          `${process.env.VUE_APP_ROOT_WS}/gateway_state/?token=${vm.token}`
      )

      vm.chat_socket.onmessage = function(e) {
        const data = JSON.parse(e.data)
        console.log(data)
        vm.model.gateway_lines.data = data.message
      }

      vm.chat_socket.onclose = function() {
          console.log('Socket closed')
          vm.chat_socket = null
          clearInterval(vm.poll_interval)
          if (!document.hidden) {
            console.log('socket reconnect in 5 sec')
            setTimeout(vm.openSocket, 5000)
          }
      }
      vm.poll_interval = setInterval(function(){
          vm.chat_socket.send(JSON.stringify({
              'message': 'get_data'
          }));
      }, 10000)
    },
    closeSocket() {
      const vm = this
      if (vm.chat_socket.readyState === 1) {
          vm.chat_socket.close()
          clearInterval(vm.poll_interval)
      }
    },
    visibilityChange() {
      const vm = this
      if (document.hidden) {
          vm.closeSocket()
      } else {
          vm.openSocket()
      }
    }
  },
  beforeMount () {
    const vm = this
    vm.getData('gateway_lines')
    vm.openSocket()
    // document.addEventListener("visibilitychange", vm.visibilityChange)
  },
  beforeDestroy() {
    const vm = this
    vm.chat_socket.onclose = function() {console.log('Socket closed')}
    vm.closeSocket()
    vm.chat_socket = null
    clearInterval(vm.poll_interval)
    // document.removeEventListener("visibilitychange", vm.visibilityChange)
  }
}
</script>
<style scoped>
  .q-table thead tr, .q-table tbody td {
    height: 32px;
  }
  .q-table tbody tr:nth-child(odd) td{
    background: #eee;
  }
  .green_circle {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: green;
    display: inline-block;
  }
  .red_circle {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: red;
    display: inline-block;
  }
</style>
