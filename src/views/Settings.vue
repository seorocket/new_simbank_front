<template lang="pug">
  div
    //- SHEDULER
    div.page_title_divider Сервер
    q-btn(
      :ripple="false" 
      color="secondary" 
      style="margin-left: 10px;" 
      label="Добавить настройки Сервера" 
      no-caps
      v-on:click="popup.add_sheduler = true")
    table.table
      thead
        tr
          th Имя сервера
          th Адрес 
          th Дата создания
          th Действие
      tbody
        tr(v-for="s in shedulers")
          td {{ s.name }}
          td {{ s.path }}
          td {{ s.datetime }}
          td
            q-btn(size="sm" round color="deep-orange" icon="delete" v-on:click="sumbit(`/simbank_scheduler/${s.pk}/`, '/simbank_scheduler/', 'shedulers')")

    q-dialog(
      v-model="popup.add_sheduler || popup.edit_sheduler"
      persistent
      )
      q-card
        q-card-section(class="row items-center")
          span(class="q-ml-sm text-h6") Добавить Сервер
        q-card-section(class="row items-center")
            span(class="q-ml-sm") Cервер нужен для установки ПО Sсheduler Server. Эта утилита, позволяющая выполнять централизованное управление оборудованием.
            span(class="q-ml-sm") С помощью этого программного обеспечения SIMBank и GoIP будут зарегистрированы на сервере SIMBankScheduler. Используя Scheduler Server, можно одновременно управлять несколькими GSM-шлюзами и SIM-банками и управлять работой более чем 10 000 SIM-карт из веб-платформы Simbank.pro 
            span(class="q-ml-sm") Подробнее о работе Sсheduler Server читайте в FAQ
            span(class="q-ml-sm") Стоимость аренды сервера  - 500 руб\мес. 
            span(class="q-ml-sm") *плата за аренду сервера будет списываться с баланса аккаунта
            q-btn(
              flat
              label="Создать"
              color="primary"
              v-if="popup.add_sheduler"
              v-on:click="createObject(popup.add_sheduler_data, '/simbank_scheduler/pay_server/', '/simbank_scheduler/', 'shedulers')"
              )
            q-btn(
              flat
              label="Изменить"
              color="primary"
              v-if="popup.edit_sheduler"
              v-on:click="editObject(popup.add_sheduler_data, `/simbank_scheduler/scheduler_create/`, '/simbank_scheduler/', 'shedulers')"
              )

            q-btn(
              flat
              label="Отмена"
              color="primary"
              v-on:click="popup.add_sheduler = popup.edit_sheduler = false;"
              )

    //- SHEDULER END

    //- SIMBANK
    div.page_title_divider Симбанк
    q-btn(
      :ripple="false" 
      color="secondary" 
      style="margin: 15px 0 0 10px;" 
      label="Добавить настройки Симбанка" 
      no-caps
      v-on:click="popup.add_simbank = true")
    table.table
      thead
        tr
          th Название
          th ID
          th Тип
          th Действие
      tbody
        tr(v-for="s in simbanks")
          td {{ s.name }}
          td {{ s.simbankid }}
          td {{ s.type }}
          td
            q-btn(size="sm" round color="deep-orange" icon="delete" v-on:click="sumbit(`/simbank/${s.pk}/`, '/simbank/', 'simbanks')")

    q-dialog(
      v-model="popup.add_simbank || popup.edit_simbank"
      persistent
      )
      q-card
        q-card-section(class="row items-center")
          span(class="q-ml-sm text-h6") Добавить Simbank
        q-card-section(class="row items-center")
            //- q-input(
            //-   v-model="popup.add_simbank_data.name"
            //-   label="Укажите название симбанка"
            //-   type="text"
            //-   lazy-rules
            //-   outlined
            //-   stack-label
            //-   style="width: 100%; margin-bottom: 10px"
            //- )
            q-input(
              v-model="popup.add_simbank_data.simbankid"
              label="Укажите ID симбанка"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-input(
              v-model="popup.add_simbank_data.password"
              label="Укажите пароль от симбанка"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )

            q-select(
              outlined
              v-model="popup.add_simbank_data.type" 
              :options="settings.smb_type" 
              label="Укажите тип симбанка" 
              stack-label 
              style="width: 100%; margin-bottom: 10px"
            )
            q-select(
              outlined
              v-model="popup.add_simbank_data.imeimode" 
              :options="settings.imeimode" 
              label="Укажите imeimode от симбанка" 
              stack-label 
              style="width: 100%; margin-bottom: 10px"
            )
            //- q-input(
            //-   v-model="popup.add_simbank_data.path"
            //-   label="Укажите url от симбанка"
            //-   type="text"
            //-   lazy-rules
            //-   outlined
            //-   placeholder="http://9.9.9.9:4441"
            //-   stack-label
            //-   style="width: 100%; margin-bottom: 10px"
            //- )
            q-select(
              outlined
              v-model="popup.add_simbank_data.scheduler" 
              :options="settings.scheduler" 
              label="Укажите Sheduler" 
              stack-label 
              style="width: 100%; margin-bottom: 10px"
            )
            q-btn(
              flat
              label="Создать"
              color="primary"
              v-if="popup.add_simbank"
              v-on:click="createObject(popup.add_simbank_data, '/simbank/simbank_create/', '/simbank/', 'simbanks')"
              )
            q-btn(
              flat
              label="Изменить"
              color="primary"
              v-if="popup.edit_simbank"
              v-on:click="editObject(popup.add_simbank_data, '/simbank/simbank_create/', '/simbank/', 'simbanks')"
              )
            q-btn(
              flat
              label="Отмена"
              color="primary"
              v-on:click="popup.add_simbank = popup.edit_simbank = false"
              )

    //- SIMBANK END

    //- GO IP
    div.page_title_divider GOIP
    q-btn(
      :ripple="false" 
      color="secondary" 
      style="margin-left: 10px;" 
      label="Добавить настройки GOIP" 
      no-caps
      v-on:click="popup.add_goip = true")
    table.table
      thead
        tr
          th Имя GOIP
          th ID GOIP
          th Тип GOIP
          th Логин GOIP
          th Действие
      tbody
        tr(v-for="g in goips")
          td {{ g.name }}
          td {{ g.simbankid }}
          td {{ g.type }}
          td {{ g.login }}
          td
            q-btn(size="sm" round color="deep-orange" icon="delete" v-on:click="sumbit(`/goip/${g.id}/`, '/goip/get_list/', 'goips')")


    q-dialog(
      v-model="popup.add_goip || popup.edit_goip"
      persistent
      )
      q-card
        q-card-section(class="row items-center")
          span(class="q-ml-sm text-h6") Добавить GOIP
        q-card-section(class="row items-center")
            //- q-input(
            //-   v-model="popup.add_goip_data.name"
            //-   label="Название GOIP"
            //-   type="text"
            //-   lazy-rules
            //-   outlined
            //-   stack-label
            //-   style="width: 100%; margin-bottom: 10px"
            //- )
            q-select(
              outlined
              v-model="popup.add_goip_data.scheduler_id" 
              :options="settings.scheduler" 
              label="Укажите Sheduler" 
              stack-label 
              style="width: 100%; margin-bottom: 10px"
            )
            q-input(
              v-model="popup.add_goip_data.simbankid"
              label="Укажите ID GOIP"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-input(
              v-model="popup.add_goip_data.password"
              label="Укажите пароль GOIP для сервера"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-select(
              outlined
              v-model="popup.add_goip_data.type" 
              :options="settings.goip_slots" 
              label="Укажите тип GOIP" 
              stack-label 
              style="width: 100%; margin-bottom: 10px"
            )
            //- q-input(
            //-   v-model="popup.add_goip_data.path"
            //-   label="Укажите url от GOIP"
            //-   type="text"
            //-   placeholder="http://9.9.9.9:4441"
            //-   lazy-rules
            //-   outlined
            //-   stack-label
            //-   style="width: 100%; margin-bottom: 10px"
            //- )
            //- q-input(
            //-   v-model="popup.add_goip_data.login"
            //-   label="Логин от GOIP"
            //-   type="text"
            //-   lazy-rules
            //-   outlined
            //-   stack-label
            //-   style="width: 100%; margin-bottom: 10px"
            //- )
            //- q-input(
            //-   v-model="popup.add_goip_data.pwd"
            //-   label="Пароль от GOIP"
            //-   type="text"
            //-   lazy-rules
            //-   outlined
            //-   stack-label
            //-   style="width: 100%; margin-bottom: 10px"
            //- )
            q-btn(
              flat
              label="Создать"
              color="primary"
              v-if="popup.add_goip"
              v-on:click="createObject(popup.add_goip_data, '/goip/goip_create/', '/goip/get_list/', 'goips')"
              )
            q-btn(
              flat
              label="Изменить"
              color="primary"
              v-if="popup.edit_goip"
              v-on:click="editObject(popup.add_goip_data, '/goip/goip_create/', '/goip/get_list/', 'goips')"
              )
            q-btn(
              flat
              label="Отмена"
              color="primary"
              v-on:click="popup.add_goip = popup.edit_goip = false"
              )
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      popup: {
        //- GOIP
        add_goip: false,
        edit_goip: false,
        add_goip_data: {
          edcr: "create",
          name: '',
          scheduler: "",
          goip_id: '',
          pwd: '1',
          simbankid:'',
          path: '1',
          scheduler_id: '',
          login: '1',
          password: '',
          path_sms: '',
          type: {'label': '32', 'value': '32'}
        },
        //- SIMBANK
        add_simbank: false,
        edit_simbank: false,
        add_simbank_data: {
            edcr: "create",
            imeimode: {'label': 'GOIP Default', 'value': 1},
            name: "",
            password: "",
            path: "1",
            scheduler: "",
            simbankid: "",
            smb_id: "",
            type: {'label': '128', 'value': 1}
        },
        //- SHEDULER
        add_sheduler: false,
        edit_sheduler: false,
        add_sheduler_data: {
            custom_id: '',
            login: "",
            name: "",
            password: "",
            path: "",
            scheduler_id: 0
        }
      },
      settings: {
        scheduler: [],
        goip_slots: [
          {'label': '1', 'value': '1'},
          {'label': '4', 'value': '4'},
          {'label': '8', 'value': '8'},
          {'label': '16', 'value': '16'},
          {'label': '32', 'value': '32'}
        ],
        smb_type: [
          {'label': '32', 'value': 2},
          {'label': '128', 'value': 1}
        ],
        imeimode: [
          {'label': 'GOIP Default', 'value': 1},
          {'label': 'Random', 'value': 2},
          {'label': 'Set with Slot', 'value': 3},
          {'label': 'Random with IMSI', 'value': 4},
          {'label': 'Set from database with IMSI', 'value': 5}
        ]
      },
      //- Списки данных
      goip_settings: [],
      goips: [],
      shedulers: [],
      simbanks: []
    }
  },
  watch: {
    'popup.add_simbank_data.simbankid'(event) {
      if(event != undefined){
        this.popup.add_simbank_data.name = 'smb#' + String(event)
      }
    },
    'popup.add_goip_data.simbankid'(event) {
      if(event != undefined){
        this.popup.add_goip_data.name = 'goip#' + String(event)
      }
    },
    'popup.add_sheduler_data.custom_id'(event) {
      if(event != undefined){
        this.popup.add_sheduler_data.name = 'server#' + String(event)
      }
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
    createObject (data, url, url_callback=false, path=false) {
        const vm = this
        let new_data = {}
        for (let key in data) {
            if (typeof data[key] === "object") {
                new_data[key] = data[key].value
            } else {
                new_data[key] = data[key]
            }
        }
        axios.post(url, new_data).then(response => {
          console.log(response.status);
          if (response.status == 201 || response.status == 200) {
            vm.popup.add_sheduler = false
            vm.popup.add_simbank = false
            vm.popup.add_goip = false
            if ( url_callback && path ) {
                vm.getData(url_callback, path)
            }
            vm.showNotify('top-right', 'Настройки добавлены!', 'positive')
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
            if (typeof data[key] === "object" && data[key] != null) {
                new_data[key] = data[key].value
            } else {
                new_data[key] = data[key]
            }
        }
        axios.post(url, new_data).then(response => {
          vm.popup.edit_sheduler = false
          vm.popup.edit_simbank = false
          vm.popup.edit_goip = false
          if (response.status == 200) {
            vm.popup.add_sheduler = vm.popup.edit_sheduler = false
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
          if (url === '/goip/get_list/') {
            vm[path] = response.data.settings
          } else {
            vm[path] = response.data
          }
          if (url === '/simbank_scheduler/') {
            vm.settings.scheduler = response.data.map(function(i){ return {'label': i.name, 'value': i.pk}})
            for(let i in response.data) {
              response.data[i]['scheduler_id'] = response.data[i]['pk']
            }
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
  beforeMount () {
    this.getData('/simbank_scheduler/', 'shedulers')
    this.getData('/simbank/', 'simbanks')
    this.getData('/operator/', 'operator')
    this.getData('/goip/get_list/', 'goips')
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
