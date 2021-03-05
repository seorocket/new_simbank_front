<template lang="pug">
  div(style="float: left; width: calc(100% - 40px); margin: 20px;")
    q-input(filled label="Дата от" v-model="filter.start" style="width: 250px; float: left; margin: 15px 0;")
      template(v-slot:prepend)
        q-icon(name="event" class="cursor-pointer")
          q-popup-proxy(transition-show="scale" transition-hide="scale")
            q-date(v-model="filter.start" mask="YYYY-MM-DD HH:mm")
              div(class="row items-center justify-end")
                q-btn(v-close-popup label="Close" color="primary" flat)

      template(v-slot:append)
        q-icon(name="access_time" class="cursor-pointer")
          q-popup-proxy(transition-show="scale" transition-hide="scale")
            q-time(v-model="filter.start" mask="YYYY-MM-DD HH:mm" format24h)
              div(class="row items-center justify-end")
                q-btn(v-close-popup label="Close" color="primary" flat)

    q-input(filled label="Дата до" v-model="filter.end" style="width: 250px; float: left; margin: 15px 20px 15px;")
      template(v-slot:prepend)
        q-icon(name="event" class="cursor-pointer")
          q-popup-proxy(transition-show="scale" transition-hide="scale")
            q-date(v-model="filter.end" mask="YYYY-MM-DD HH:mm")
              div(class="row items-center justify-end")
                q-btn(v-close-popup label="Close" color="primary" flat)

      template(v-slot:append)
        q-icon(name="access_time" class="cursor-pointer")
          q-popup-proxy(transition-show="scale" transition-hide="scale")
            q-time(v-model="filter.end" mask="YYYY-MM-DD HH:mm" format24h)
              div(class="row items-center justify-end")
                q-btn(v-close-popup label="Close" color="primary" flat)

    q-btn(label="Применить" color="primary" v-on:click="filterByDates()" style="margin: 23px 0 0 10px;")

    //- selection="multiple"
    //- :selected.sync="selected"
    q-table(
      title="Список cмс"
      :data="data"
      :columns="columns"
      :rows-per-page-options="[25, 50, 100, 0]"
      style="float: left; width: 100%; padding-right: 20px;"
    )
</template>

<script>
import axios from 'axios'
import { date } from 'quasar'
export default {
  data () {
    return {
      filter: {
        start: '',
        end: ''
      },
      selected: [],
      data: [],
      data2: [],
      columns: [
        {
          name: 'sms_sender',
          required: true,
          label: 'Номер',
          align: 'left',
          field: 'sms_sender',
          sortable: true
        },
        {
          name: 'datetime',
          required: true,
          label: 'Дата',
          align: 'center',
          field: 'datetime',
          sortable: true
        },
        {
          name: 'content',
          required: true,
          field: 'content',
          label: 'Сообщение',
          align: 'center',
          sortable: false
        }
      ],
      popup: {
        add_sim: false,
        edit_sim: false,
        activate_sim: false,
        activate_sim_data: {
          goip: '',
          sim: ''
        },
        add_sim_data: {
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
    filterByDates () {
      this.getData('/sim/get_all_sms/', 'data', this.filter)
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
            vm.showNotify('top-right', 'Настройки добавлены!', 'positive')
          }
        })
    },
    openEdit( popup, item ) {
        const vm = this
        vm.popup['edit_' + popup.split('_')[1]] = true
        vm.popup[popup + '_data'] = item
    },
    getData (url, path, data={}) {
        const vm = this
        axios.post(url, data).then(response => {
            vm[path] = response.data.message

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
    const f_start = new Date().setDate(new Date().getDate() -1 )
    const f_end = new Date()
    this.getData('/sim/get_all_sms/', 'data', {'start': date.formatDate(f_start, 'YYYY-MM-DD HH:mm:ss'), 'end': date.formatDate(f_end, 'YYYY-MM-DD') + ' 23:59:59'})
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
