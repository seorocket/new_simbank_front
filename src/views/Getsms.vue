<template lang="pug">
  div
    div.row
      div.col-md-2.q-pa-md
        q-btn-dropdown(auto-close color="green" label="Получить SMS" style="width: 100%")
            <!-- dropdown content goes here -->
            q-list(padding)
                q-item(clickable v-on:click="createTask(true)")
                    q-item-label По Сервису
                q-item(clickable v-on:click="popup.get_sim = true")
                    q-item-label По номеру
        div.services
            span Все
            div.service(v-for="s in settings.service" clickable v-on:click="updateTaskService(s.pk)" v-bind:class="{ 'active': active_state === s.pk }")
                img(:src="'http://favicon.yandex.net/favicon/' + s.name" style="position: relative; top: 3px; margin-right: 5px;")
                span {{ s.name }}
      div.col-md-10
        h3.text-h5(style="margin-bottom: -9px;") Активации
        table.table
            colgroup
              col(width="15%")
              col(width="15%")
              col(width="50%")
              col(width="20%")
            thead
                tr
                    th Сервис/Время
                    th Оператор/Номер
                    th СМС ответ/подсказка/пояснение
                    th Действие и статус
            tbody
                tr(v-for="t in tasks.message" v-if="[1,2,3].indexOf(t.status) > -1")
                    td(v-html="`${t.time_left || t.lifetime} мин.`")
                    td 
                        img(:src="t.phone.operator.image_path" style="position: relative; top: 3px; right: 5px;")
                        | {{ t.phone.operator.name }} / {{ t.phone.name }}
                    td 
                      template(v-if="t.status == 1") Номер подготваливается
                      template(v-if="t.status == 2") Используйте номер для активации и нажмите кнопку "смс отправлено".
                        br
                        q-btn.q-mr-sm(
                          size="sm"
                          color="secondary"
                          label="СМС отправлено"
                          v-on:click="sendPost('task/set_sms_sent_status/', {'hash': t.hash})"
                          )
                        q-btn.q-mr-sm(
                          size="sm"
                          color="red"
                          label="Номер использован"
                          v-on:click="sendPost('task/set_phone_used_status/', {'hash': t.hash})"
                          )
                      template(v-if="t.status == 3 && !t.sms_data.length") Ожидание смс
                      template(v-if="t.status == 3 && t.sms_data.length")
                        div(v-for="item in t.sms_data" style="text-align: left; padding: 10px; border: 1px solid #333; border-radius: 6px; margin-bottom: 5px;")
                          span Отправитель: {{ item.sms_sender }} [{{ item.datetime }}]
                          br
                          span Сообщение: {{ item.content }}
                        br
                        q-btn.q-mr-sm(
                          size="sm"
                          color="secondary"
                          label="Завершить сессию"
                          v-on:click="sendPost('task/set_phone_used_status/', {'hash': t.hash})"
                          style="float: left;"
                          )
                    td 
                        q-btn(
                          size="sm" 
                          round 
                          color="deep-orange" 
                          icon="delete"
                          v-on:click="sendPost('task/task_delete/', {'task_pk': t.hash})")
    q-dialog(
      v-model="popup.get_sim"
      persistent
      )
      q-card
        q-card-section(class="row items-center")
          span(class="q-ml-sm text-h6") Добавить SIM
        q-card-section(class="row items-center")
            q-select(
                filled
                v-model="task_data.phone"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                label="Sim"
                :options="options"
                @filter="(val, update, abort) => filterFn(val, update, abort, 'sim')"
                @filter-abort="abortFilterFn"
                style="width: 250px"
                hint="Например: +79999999999"
                :clearable="true")

                template(v-slot:no-option)
                  q-item
                    q-item-section.text-grey Нет данных
            q-btn(
              flat
              label="Создать"
              color="primary"
              v-if="popup.get_sim"
              v-on:click="createTask(false)"
              )
            q-btn(
              flat
              label="Отмена"
              color="primary"
              v-on:click="popup.get_sim = popup.edit_sim = false"
              )    
</template>

<script>

import { date } from 'quasar'
import axios from 'axios'

export default {
  data () {
    return {
      tasks: {
        "message": []
      },
      sim_used: {
          sim: ''
       },
      settings: {
        service: [{"pk":1,"name":"yahoo.com","url":"yahoo.com","comment":null},{"pk":2,"name":"gmail.com","url":"mail.google.com","comment":null},{"pk":4,"name":"mail.ru","url":"mail.ru","comment":null}]
      },
      task_data: {
        lifetime: 20,
        without_service: true,
        phone: ''
      },
      task_service: {
        without_service: false,
        service_id: '1'
      },
      active_state : '1',
      options: [],
      popup: {
        get_sim: false,
        get_sim_data: {
          bank: "",
          name: "",
          operator: "",
          pay_operation: {'label': 'Нет', 'value': 0},
          services_id: [],
          sim_id: null,
          slot: "",
          status: {'label': 'Работает', 'value': 1}
        }
      },
    }
  },
  methods: {
    sendPost(url, data) {
        const vm = this
        axios.post(url, data).then(response => {
          response.data
          vm.getData('/task/', 'tasks')
        })
    },
    updateTasks () {
      const vm = this
      for (let i in vm.tasks.message) {
        let curr_date = new Date()
        curr_date = date.extractDate(vm.tasks.message[i].datetime.split('.')[0] + '+03:00', 'YYYY-MM-DDTHH:mm:ssZ')
        curr_date = curr_date.getTime() + 60 * vm.tasks.message[i].lifetime * 1000
        if (date.getDateDiff(curr_date, new Date(), 'minutes')) {
            vm.tasks.message[i]['time_left'] = date.getDateDiff(curr_date, new Date(), 'minutes')
        }

        if ([1,2].indexOf(vm.tasks.message[i].status) > -1) {
          axios.post('task/get_status/', {'task': vm.tasks.message[i].hash}).then(response => {
            if (response.data.message != 1) {
              vm.tasks.message[i].status = response.data.message
            }
          })
        } else if (vm.tasks.message[i].status == 3) {
          axios.get('goip/get_sms/?hash=' + vm.tasks.message[i].hash).then(response => {
            if (response.data.message == 'waiting') {
              vm.tasks.message[i].sms_data = []
            } else {
              vm.tasks.message[i].sms_data = response.data.message.sms
            }
          })
        }
      }
    },
    filterFn (val, update, abort, url) {
        const vm = this       
        update(() => {
            const needle = val.toLowerCase()
             axios.get(url +'/?get_extended=1&sim=' + needle).then(response => {
              vm.options = response.data.map(function(i){return{label: i.name, value: i.name }})
            })  
        })      
    },
    updateTaskService(service_id){
	const vm = this
        vm.task_service.service_id = service_id
        vm.active_state = service_id
    },
    createTask (choose=false) {
      const vm = this
      const url = 'task/'
      vm.task_data.phone = vm.task_data.phone.value
      if (!choose) {
        axios.post(url, vm.task_data).then(response => {
          if( response.data.message.hash){
            axios.post('sim/check_goip_slot_sim/', {'task': response.data.message.hash}).then(response => {
              vm.tasks.message.push(response.data.message)
              vm.getData('/task/', 'tasks')
            })
          }
        })
      }else{
        axios.post(url, vm.task_service).then(response => {
          axios.post('sim/check_goip_slot_sim/', {'task': response.data.message.hash}).then(response => {
           vm.tasks.message.push(response.data.message)
           vm.getData('/task/', 'tasks')
          })
        })
      }
      vm.popup.get_sim = vm.popup.edit_sim = false 
    },
    getData (url, path) {
        const vm = this
        axios.get(url).then(response => {
            vm[path] = response.data
            vm.updateTasks()
        })
    }
  },
  beforeMount () {
    const vm = this
    this.getData('/task/', 'tasks')
     axios.get('sim/?get_extended=1&sim=').then(response => {
        vm.options = response.data.map(function(i){return{label: i.name, value: i.name }})
      })
     window.timeout = setInterval(() =>
      vm.updateTasks()
    , 5000)	
  }
}
</script>
<style scoped>
  .services {
    width: 100%;
  }
  .services .service {
    padding: 0.5rem 2rem;
  }
  .services .service:nth-child(odd) {
    background: rgb(246, 250, 254);
  }
  .services > span {
      display: block;
      margin-top: 15px;
      font-size: 24px;
      background: #e6e3da;
      line-height: 30px;
      padding: 6px 10px;
  }
  .q-item__label {
    line-height: 32px!important;
  }
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
  .table tbody tr td {
      border: 1px solid #333;
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
  .service.active {
    border: 1px solid green;
  }
</style>
