<template lang="pug">
  div
    q-table(
      title="Список cмс"
      :data="data"
      :columns="columns"
      row-key="name"
      v-slot:body="props"
      selection="multiple"
      :selected.sync="selected"
    )
        q-tr(:props="props")
            q-td(key="selected")
              q-checkbox(dense v-model="props.selected")
            </q-card-section>
            q-td(key="slot" :props="props" v-html="props.row.slot")
            q-td(key="name" :props="props")
              <img :src="props.row.operator_image" style="position: relative; top: 2px; right: 3px;"> {{ props.row.name }}
            q-td(key="pk" :props="props")
                button Посмотреть
            q-td(key="pay_operation" :props="props")
                q-icon(
                  :name="props.row.pay_operation ? 'add_circle' : 'remove_circle'"
                  :style="'font-size: 30px; color: ' + (props.row.pay_operation ? 'green' : 'red')")
            q-td(key="last_pay_operation" :props="props") {{ props.row.last_pay_operation }}
            q-td(key="imei" :props="props") -
            q-td(key="actions" :props="props")
                q-btn.q-mr-sm(
                    size="sm"
                    color="secondary"
                    label="Активировать"
                    v-on:click="popup.activate_sim = true, popup.activate_sim_data.sim = props.row.name, getData('/goip/goip_lines_status/', 'data2')"
                )
                q-btn(size="sm" round color="secondary" icon="edit" style="margin-right: 10px;" v-on:click="openEdit('add_sim', props.row)")
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      selected: [],
      data: [],
      data2: [],
      columns: [
        {
          name: 'slot',
          required: true,
          label: 'Слот в Sim-Банке',
          align: 'center',
          sortable: true
        },
        {
          name: 'name',
          required: true,
          label: 'Номер',
          align: 'left',
          sortable: true
        },
        {
          name: 'last_pay_operation',
          required: true,
          label: 'Дата',
          align: 'center',
          sortable: false
        },
        {
          name: 'imei',
          required: true,
          label: 'IMEI',
          align: 'center',
          sortable: false
        },
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
    getData (url, path) {
        const vm = this
        axios.post(url).then(response => {
          if (url === '/goip/goip_lines_status/') {
            vm[path] = response.data.map(function (i) {
              return {'value': i.line_id, 'label': i.phone_number ? `${i.line_id} (${i.phone_number})` : i.line_id}
            })
          } else {
            vm[path] = response.data
          }
          if (url === '/simbank/' || url === '/operator/') {
            vm.settings[path] = response.data.map(function(i){ return {'label': i.name, 'value': i.pk}})
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
    this.getData('/sim/get_all_sms/', 'data')
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
