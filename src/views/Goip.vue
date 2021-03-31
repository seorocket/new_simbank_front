<template lang="pug">
  div
    table.table
      thead
        tr
          th ID Линии
          th Авторизация
          th GSM Статус
          th Оператор / Номер
          th Сигнал
          th SIM ID
          th IMEI
          th Действие
      tbody
        tr(v-for="g in goip_lines")
          td {{ g.line_id }}
          td
            div.green_circle(v-if="g.login === 'ONLINE' || g.login === 'IDLE'")
            div.red_circle(v-else)
          td
            div.green_circle(v-if="g.gsm_status === 'LOGIN'")
            div.red_circle(v-else)
          td 
            template(v-if="g.phone_number")
              img(:src="g.operator_image" style="position: relative; top: 3px;")
              |  {{ g.phone_number }}
          td {{ g.signal }}
          td(v-html=" g.sim_id ? g.sim_id : '-'")
          td {{ g.imei }}
          td
            q-btn(v-if="g.sim_id" size="xs" color="secondary" label="Отправить СМС" style="margin-right: 10px;" @click="popup.sendSms = true; popup.sendSms_data.line_id = g.line_id")
            q-btn(v-if="g.sim_id" size="xs" color="secondary" label="USSD" style="margin-right: 10px;" @click="popup.sendUSSD = true; popup.sendUSSD_data.line_id = g.line_id")
            q-btn(v-if="g.sim_id" size="xs" color="secondary" label="отключить" style="margin-right: 10px;" @click="removeSIM(g.sim_id)")


    q-dialog(
      v-model="popup.add_goip"
      persistent
      )
      q-card
        q-card-section(class="row items-center")
          span(class="q-ml-sm text-h6") Добавить GOIP
        q-card-section(class="row items-center")
            q-input(
              v-model="popup.add_goip_data.name"
              label="Название GOIP"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-select(
              outlined
              v-model="popup.add_goip_data.sheduler" 
              :options="settings.sheduler" 
              label="Укажите Sheduler" 
              stack-label 
              style="width: 100%; margin-bottom: 10px"
            )
            q-input(
              v-model="popup.add_goip_data.goip_id"
              label="Укажите ID GOIP"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-input(
              v-model="popup.add_goip_data.server_password"
              label="Укажите пароль GOIP для сервера"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-select(
              outlined
              v-model="popup.add_goip_data.goip_slots" 
              :options="settings.goip_slots" 
              label="Укажите тип GOIP" 
              stack-label 
              style="width: 100%; margin-bottom: 10px"
            )
            q-input(
              v-model="popup.add_goip_data.url"
              label="Укажите url от GOIP"
              type="text"
              placeholder="http://9.9.9.9:4441"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-input(
              v-model="popup.add_goip_data.login"
              label="Логин от GOIP"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-input(
              v-model="popup.add_goip_data.password"
              label="Пароль от GOIP"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-input(
              v-model="popup.add_goip_data.url_sms_service"
              label="URL от SMS сервиса"
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
              )
            q-btn(
              flat
              label="Отмена"
              color="primary"
              v-on:click="popup.add_goip = false"
              )
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

export default {
  meta: {
    title: 'GOIP - Линии'
  },
  data () {
    return {
      submitting: false,
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
        },
        add_goip: false,
        add_goip_data: {
          name: '',
          sheduler: {'label':'onec', 'value': 1},
          goip_id: '',
          server_password: '',
          goip_slots:'',
          url: '',
          login: '',
          password: '',
          url_sms_service: ''
        },
      },
      settings: {
        sheduler: [{'label':'onec', 'value': 1}],
        goip_slots: [
          {'label': '1', 'value': '1'},
          {'label': '4', 'value': '4'},
          {'label': '8', 'value': '8'},
          {'label': '16', 'value': '16'},
          {'label': '32', 'value': '32'}
        ]
      },
      goip_settings: [],
      goip_lines: []
    }
  },
  methods: {
    getPageInfo () {
      const vm = this
      axios.get('/goip/').then(response => {
        vm.goip_lines = response.data.message
      })
    },
    removeSIM (sim) {
        const vm = this
        axios.post('/sim/remove_sim_on_goip/', {'sim': sim}).then(response => {
          if (response.data.message === 'ok') {
            vm.getPageInfo()
            vm.showNotify('top-right', 'Сим-карта успешно извлечена!', 'positive')
          }
        })
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
          vm.showNotify('top-right', response.data.message, 'positive')
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
        timeout: 3000
      })
    }
  },
  beforeMount () {
    this.getPageInfo()
   window.timeout = setInterval(() =>
      this.getPageInfo()
    , 10000)
  }
}
</script>
<style scoped>
  .table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  .table th {
    font-weight: normal;
    font-size: 15px;
    text-transform: uppercase;
    background: #e6e3da;
    padding: 10px;
  }
  .table tbody tr td, .table tbody tr th {
    text-align: center;
    padding: 5px 8px;
    border-bottom: 1px solid #ddd;
  }
  .table tbody tr:nth-child(even) td{
    background: #eee;
  }
  .page_title_divider {
    text-align: center;
    min-width: 1px;
    max-width: 100%;
    font-size: 21px;
    font-weight: normal;
    letter-spacing: 0.01em;
    color: #fff;
    background: #027BE3;
    line-height: 50px;
    opacity: 0.9;
    box-shadow: 0 2px 8px -3px rgb(0 0 0);
    margin: 20px 0;
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
