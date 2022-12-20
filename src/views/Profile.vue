<template lang="pug">
  div
    q-card
      q-card-actions
        q-input(filled label="Дата от" v-model="filter.start" style="margin-right: 10px")
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

        q-input(filled label="Дата до" v-model="filter.end" style="margin-right: 10px")
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

        q-btn(label="Применить" color="primary" :disabled="!filter.start || !filter.end" v-on:click="filterByDates()")

      q-separator
      q-card-section
        q-table(
          title="Список cмс"
          :data="model.sms.data"
          :columns="columns"
          :rows-per-page-options="[25, 50, 100, 0]"
        )
</template>

<script>
import mixins from "../plugins/general"
import { date } from 'quasar'

export default {
  mixins: [mixins],
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
          name: 'phone',
          required: true,
          label: 'Используемый номер',
          align: 'left',
          field: 'phone',
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
          style: 'white-space: pre-wrap;',
          label: 'Сообщение',
          align: 'center',
          sortable: false
        }
      ]
    }
  },
  methods: {
    filterByDates () {
      const params = `start=${this.filter.start}&end=${this.filter.end}`
      this.getData('sms', params)
    },
  },
  beforeMount () {
    const f_start = new Date().setDate(new Date().getDate() -1 )
    const f_end = new Date()
    let params = `start=${date.formatDate(f_start, 'YYYY-MM-DD HH:mm:ss')}&end=${date.formatDate(f_end, 'YYYY-MM-DD HH:mm:ss')}`
    this.getData('sms', params)
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
</style>
