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
                q-btn(v-if="props.row.sim_id" size="xs" color="secondary" label="Отправить СМС" style="margin-right: 10px;" @click="popup.sendSms = true; popup.sendSms_data.line_id = props.row.line_id")
                q-btn(v-if="props.row.sim_id" size="xs" color="secondary" label="USSD" style="margin-right: 10px;" @click="popup.sendUSSD = true; popup.sendUSSD_data.line_id = props.row.line_id")
                q-btn(v-if="props.row.sim_id" size="xs" color="secondary" label="Отключить" style="margin-right: 10px;" @click="removeSIM(props.row.id)")

    q-dialog(
      v-model="popup.sendUSSD"
      persistent
      )
      q-card
        q-card-section(class="row items-center")
          span(class="q-ml-sm text-h6") Отправить USSD команду
        q-card-section(class="row items-center")
            q-input(
              v-model="popup.sendUSSD_data.command"
              label="USSD команда"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-btn(
              flat
              label="Продолжить"
              color="primary"
              type="submit"
              :loading="submitting"
              v-on:click="sendUSSD()"
              )
              template(v-slot:loading)
                q-spinner-facebook

            q-btn(
              flat
              label="Отмена"
              color="primary"
              v-on:click="popup.sendUSSD = false"
              )
    q-dialog(
      v-model="popup.sendSms"
      persistent
      )
      q-card
        q-card-section(class="row items-center")
          span(class="q-ml-sm text-h6") Отправить SMS
        q-card-section(class="row items-center")
            q-input(
              v-model="popup.sendSms_data.phone"
              label="На какой номер отправить?"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-input(
              v-model="popup.sendSms_data.command"
              label="SMS сообщение"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-btn(
              flat
              label="Продолжить"
              color="primary"
              type="submit"
              :loading="submitting"
              v-on:click="sendSms()"
              )
              template(v-slot:loading)
                q-spinner-facebook

            q-btn(
              flat
              label="Отмена"
              color="primary"
              v-on:click="popup.sendSms = false"
              )

</template>

<script>
import axios from 'axios'
import mixins from "../plugins/general";

export default {
  mixins: [mixins],
  meta: {
    title: 'GOIP - Линии'
  },
  data () {
    return {
      submitting: false,
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
      ],
      popup: {
        sendUSSD: false,
        sendUSSD_data: {
          line_id: '',
          command: ''
        },
        sendSms: false,
        sendSms_data: {
          line_id: '',
          command: '',
          phone: ''
        }
      }
    }
  },
  methods: {
    removeSIM (sim) {
      const vm = this
      vm.actionRequest(`/sim/${sim}/activate_sim/`, {}, 'gateway_lines')
    },
    sendUSSD () {
      const vm = this
      if (!vm.submitting) {
        vm.submitting = true
        axios.post('/goip/send_ussd/', {'goip_id': vm.popup.sendUSSD_data.line_id, 'msg': vm.popup.sendUSSD_data.command}).then(response => {
          vm.showNotify('top-right', response.data, 'positive')
          vm.popup.sendUSSD = false
          vm.submitting = false
        })
      }
    },
    sendSms () {
      const vm = this
      if (!vm.submitting) {
        vm.submitting = true
        axios.post('/goip/send_sms/', {'phone': vm.popup.sendSms_data.phone, 'goip_id': vm.popup.sendSms_data.line_id, 'msg': vm.popup.sendSms_data.command}).then(response => {
          if (response.data.message === 'Сообщение отправлено') {
             vm.showNotify('top-right', response.data.message, 'positive')
          } else {
            vm.showNotify('top-right', response.data.message, 'negative')
          }
          vm.popup.sendSms = false
          vm.submitting = false
        })
      }
    },
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
    this.getData('gateway_lines')
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
