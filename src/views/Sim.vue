<template lang="pug">
  div
    q-btn(
      :ripple="false" 
      color="secondary" 
      style="margin: 15px 0 10px 10px;" 
      label="Добавить SIM" 
      no-caps
      v-if="super_user == 'true'"
      v-on:click="popup.add_sim = true")

    q-btn(
      :ripple="false"
      color="secondary"
      style="margin: 15px 0 10px 10px;"
      label="Пересканировать SIM"
      no-caps
      v-on:click="upload_sim()")
    
    q-input(
      outlined
      v-model="search"
      label="Поиск по номеру"
      style="width: 300px; float:right;"
    )

    q-table(
      title="Список номеров"
      :data="data"
      :columns="columns"
      row-key="slot"
      v-slot:body="props"
      selection="multiple"
      :selected.sync="selected"
      :rows-per-page-options="[0]"
    )
        q-tr(:props="props")
            q-td(key="selected")
              q-checkbox(dense v-model="props.selected")
            </q-card-section>
            q-td(key="status")
              div.green_circle(v-if="props.row.status === 1")
              div.red_circle(v-else)
            q-td(key="slot" :props="props" v-html="props.row.slot")
            q-td(key="name" :props="props")
              <img :src="props.row.operator_image" style="position: relative; top: 2px; right: 3px;"> {{ props.row.name }}
            q-td(key="tarif" :props="props" v-html="props.row.tarif")
            q-td(key="pk" :props="props")
                button(v-on:click="getTaskSms(props.row.pk)") Посмотреть
            q-td(key="pay_operation" :props="props")
                q-icon(
                  :name="props.row.pay_operation ? 'add_circle' : 'remove_circle'"
                  :style="'font-size: 30px; color: ' + (props.row.pay_operation ? 'green' : 'red')")
            q-td(key="last_pay_operation" :props="props") {{ props.row.last_pay_operation }}
            q-td(key="imei" :props="props") -
            q-td(key="goip_slot" :props="props" v-html="props.row.goip_slot ? props.row.goip_slot : '-' ")
            q-td(key="actions" :props="props")
                q-btn.q-mr-sm(
                    size="sm"
                    color="secondary"
                    label="Активировать"
                    v-on:click="popup.activate_sim = true, popup.activate_sim_data.sim = props.row.name, getData('/goip/', 'data2')"
                )
                q-btn(size="sm" round color="secondary" icon="edit" style="margin-right: 10px;" v-on:click="openEdit('add_sim', props.row)")
                q-btn(size="sm" round color="deep-orange" icon="delete" v-on:click="sumbit(`/sim/${props.row.pk}/`, '/sim/', 'data')")
    q-select(
      v-model='masd'
      :options='masdo'
      style="width:250px; float:left;"
      label='Выбрать действие'
      )
    q-btn(
      :ripple="false"
      color="secondary"
      style="margin: 15px 0 10px 10px;"
      label="Применить"
      no-caps
      v-on:click="up_masd()")

    q-dialog(
      v-model="popup.get_sms_task"
      persistent
      )
      q-card
        q-card-section(class="row items-center")
          span(class="q-ml-sm text-h6") Список SMS
          table.table
            colgroup
              col(width="15%")
              col(width="50%")
              col(width="15%")
            thead
                tr
                    th Отправитель
                    th Сообщение
                    th Дата отправки
            tbody
                tr(v-for="t in task.sms")
                    td {{t.datetime}}
                    td {{t.content}}
                    td {{t.sms_sender}} 
            q-btn(
              flat
              label="Закрыть"
              color="primary"
              v-on:click="popup.get_sms_task =  false"
              )

    q-dialog(
      v-model="popup.activate_sim"
      persistent
      )
      q-card
        q-card-section(class="row items-center")
          span(class="q-ml-sm text-h6") Активировать симкарту
        q-card-section(class="row items-center")
            q-select(
              outlined
              v-model="popup.activate_sim_data.goip" 
              :options="data2"
              label="Укажите свободный слот" 
              stack-label 
              style="width: 100%; margin-bottom: 10px"
            )

            q-btn(
              flat
              label="Применить"
              color="primary"
              v-on:click="createObject(popup.activate_sim_data, '/sim/update_sim/')"
              )
            q-btn(
              flat
              label="Отмена"
              color="primary"
              v-on:click="popup.activate_sim =  false"
              )

    q-dialog(
      v-model="popup.add_sim || popup.edit_sim"
      persistent
      )
      q-card
        q-card-section(class="row items-center")
          span(class="q-ml-sm text-h6") Добавить SIM
        q-card-section(class="row items-center")
            q-input(
              v-model="popup.add_sim_data.name"
              label="Укажите номер сим-карты"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-select(
              outlined
              v-model="popup.add_sim_data.status" 
              :options="settings.status"
              label="Укажите статус сим карты" 
              stack-label 
              style="width: 100%; margin-bottom: 10px"
            )
            q-select(
              outlined
              v-model="popup.add_sim_data.bank" 
              :options="settings.simbanks"
              label="Укажите симбанк" 
              stack-label 
              style="width: 100%; margin-bottom: 10px"
            )
            q-select(
              outlined
              v-model="popup.add_sim_data.operator" 
              :options="settings.operators"
              label="Укажите оператора" 
              stack-label 
              style="width: 100%; margin-bottom: 10px"
            )
            q-select(
              outlined
              v-model="popup.add_sim_data.pay_operation" 
              :options="settings.pay_operation"
              label="Использовать для платных услуг" 
              stack-label 
              style="width: 100%; margin-bottom: 10px"
            )
            q-input(
              v-model="popup.add_sim_data.slot"
              label="Номер слота симбанка, в который вставлена Сим"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-input(
              v-model="popup.add_sim_data.tarif"
              label="Описание Sim карты"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-btn(
              flat
              label="Создать"
              color="primary"
              v-if="popup.add_sim"
              v-on:click="createObject(popup.add_sim_data, '/sim/', '/sim/', 'data')"
              )
            q-btn(
              flat
              label="Изменить"
              color="primary"
              v-if="popup.edit_sim"
              v-on:click="editObject(popup.add_sim_data, `/sim/${popup.add_sim_data.pk}/`, '/sim/', 'data')"
              )
            q-btn(
              flat
              label="Отмена"
              color="primary"
              v-on:click="popup.add_sim = popup.edit_sim = false"
              )
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      selected: [],
      data: [],
      data_tmp: [],
      search: '',
      data2: [],
      masd: '',
      super_user: 'false',
      masdo: [{label: 'Включить платные действия', value:"1"},{ label:'Выключить платные действия', value:"2"}],
      columns: [
        {
          name: 'status',
          label: 'Статус Sim',
          align: 'center',
          sortable: true
        },
        {
          name: 'slot',
          field: 'slot',
          label: 'Слот в Sim-Банке',
          align: 'center',
          sortable: true
        },
        {
          name: 'name',
          field: 'name',
          label: 'Номер',
          align: 'left',
          sortable: true
        },
        {
          name: 'tarif',
          field: 'tarif',
          label: 'Описание',
          align: 'left',
          sortable: true
        },
        {
          name: 'pk',
          label: 'Последние входящие СМС',
          align: 'center',
          sortable: false
        },
        {
          name: 'pay_operation',
          label: 'PAY SERVICE',
          align: 'center',
          sortable: false
        },
        {
          name: 'last_pay_operation',
          label: 'Дата',
          align: 'center',
          sortable: false
        },
        {
          name: 'imei',
          label: 'IMEI',
          align: 'center',
          sortable: false
        },
        {
          name: 'goip_slot',
          label: 'Используется',
          field: 'goip_slot',
          align: 'center',
          sortable: true
        },
        {
          name: 'actions',
          label: 'Действие',
          align: 'center',
          sortable: false
        },
      ],
      task:{
        sms:[],
      },
      popup: {
        add_sim: false,
        edit_sim: false,
        get_sms_task: false,
        activate_sim: false,
        activate_sim_data: {
          goip: '',
          sim: ''
        },
        add_sim_data: {
          bank: "",
          name: "",
          operator: "",
          tarif: "",
          pay_operation: {'label': 'Нет', 'value': 0},
          services_id: [],
          sim_id: null,
          slot: "",
          status: {'label': 'Работает', 'value': 1}
        }
      },
      settings: {
        sheduler: [{'label':'onec', 'value': 1}],
        goip_slots: [
          {'label': '1', 'value': '1'},
          {'label': '4', 'value': '4'},
          {'label': '8', 'value': '8'},
          {'label': '16', 'value': '16'},
          {'label': '32', 'value': '32'}
        ],
        status: [
          {'label': 'Работает', 'value': 1},
          {'label': 'Не работает', 'value': 2}
        ],
        pay_operation: [
          {'label': 'Да', 'value': 1},
          {'label': 'Нет', 'value': 0}
        ],
        simbanks: [],
        operators: []
      },
      simbanks: []
    }
  },
  methods: {
    sumbit (data, url, callback, path) {
      const vm = this
      vm.$q.dialog({
        title: 'Подтвердите действие',
        message: 'Вы точно хотите удалить эти настройки?',
        ok: {
          push: true
        },
        cancel: {
          push: true,
          color: 'negative'
        },
        persistent: true
      }).onOk(() => {
        vm.deleteObject(data, url, callback, path)
      })
    },
    upload_sim(){
      const vm = this
      axios.post('/sim/upload_sim/').then(response => {
         if(response.data.m == true){
            vm.showNotify('top-right', 'Настройки добавлены!', 'positive')
            this.getData('/sim/', 'data')
         }
      }).catch(error => {
       if(error.response.status == 403){
         vm.showNotify('top-right', 'Пополните баланс!', 'negative')
         vm.$store.dispatch('authorize', '')
        }
       });
    },
    up_masd(){
      const vm =this
      console.log(vm.masd.value);
      let ss = vm.selected.map((field) => {
        return field.pk
      });
      console.log(ss);
       axios.post('/sim/update_pay/',{'status': vm.masd.value, 'sim': ss}).then(response => {
         if(response.data.message == 'ok'){
            vm.showNotify('top-right', 'Настройки изменены!', 'positive')
            this.getData('/sim/', 'data')
         }else{
            vm.showNotify('top-right', 'Произошла ошибка', 'negative')
         }
      });
    },
    createObject (data, url, url_callback=false, path=false) {
        const vm = this
        let new_data = {}
        for (let key in data) {
            if (typeof data[key] === "object" && data[key] != null) {
                new_data[key] = data[key].value
            } else {
                new_data[key] = data[key]
            }
        }
        axios.post(url, new_data).then(response => {
          if (response.status == 201 || response.status == 200) {
            vm.popup.add_sim = vm.popup.activate_sim = false
            if ( url_callback && path ) {
                vm.getData(url_callback, path)
            }
            if(response.data.message == 'Sim offline'){
              vm.showNotify('top-right', 'Sim offline', 'negative')
            }else{
               vm.showNotify('top-right', 'Настройки добавлены!', 'positive')
            }
          }
        })
    },
    openEdit( popup, item ) {
        const vm = this
        vm.popup['edit_' + popup.split('_')[1]] = true
        vm.popup[popup + '_data'] = item
    },
    editObject (data, url, url_callback=false, path=false) {
        const vm = this
        let new_data = {}
        for (let key in data) {
            console.log(data[key], key)
            if (typeof data[key] === "object" && data[key] != null) {
                new_data[key] = data[key].value
            } else {
                new_data[key] = data[key]
            }
        }
        axios.put(url, new_data).then(response => {
          if (response.status == 200) {
            vm.popup.add_sim = vm.popup.edit_sim = vm.popup.activate_sim = false
            if ( url_callback && path ) {
                vm.getData(url_callback, path)
            }
            vm.showNotify('top-right', 'Настройки изменены!', 'positive')
          }
        })
    },
    deleteObject (url, url_callback=false, path=false) {
        const vm = this
        axios.delete(url).then(response => {
          if (response.status === 204) {
            if ( url_callback && path ) {
                vm.getData(url_callback, path)
            }
            vm.showNotify('top-right', 'Настройки удалены!', 'negative')
          }
        })
    },
    getData (url, path) {
        const vm = this
        axios.get(url).then(response => {
          if (url === '/goip/') {
            axios.get(url).then(response => {
              vm.data2 = response.data.message.map(function(i){return{label: i.line_id +' ' + i.phone_number, value: i.line_id}})
            })
          } else {
            vm[path] = response.data
            vm.data_tmp = response.data
          }
          if (url === '/simbank/' || url === '/operator/') {
            vm.settings[path] = response.data.map(function(i){ return {'label': i.name, 'value': i.pk}})
          }
        })
    },
    getTaskSms(sim_id){
       const vm = this
       axios.post('/sim/get_task_by_sim/', {'sim': sim_id}).then(response => {
         if(response.data.length > 0){
           vm.task.sms = response.data
           vm.popup.get_sms_task = true
         }else{          
            vm.showNotify('top-right', 'SMS на указаной сим не найдено', 'negative')
         }
       })
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
  watch: {
    'search' (event) {
      const vm = this
      if (event !== '') {
        vm.data = vm.data_tmp.filter(item => item.name.toLowerCase().indexOf(event.toLowerCase()) > -1)
      } else {
        vm.drivers = vm.data_tmp
      } 
    }
  },
  beforeMount () {
    this.getData('/sim/', 'data')
    //this.getData('/goip/goip_lines_status/', 'data2')
    this.getData('/simbank/', 'simbanks')
    this.getData('/operator/', 'operators')
    this.super_user = localStorage.super_user
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
