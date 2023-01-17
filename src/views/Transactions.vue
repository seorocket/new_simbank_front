<template lang="pug">
  div
    q-card
      q-separator
      q-card-section
        q-table(
          title="Список транзакций"
          :data="model.transaction.data"
          :columns="columns"
          :rows-per-page-options="[25, 50, 100, 0]"
        )
          template(v-slot:body-cell="props")
            q-td(
              :props="props"
              :class="props.row.type ? 'green' : 'red'"
            ) {{ props.value }}
</template>

<script>
import mixins from "../plugins/general"
import {date} from 'quasar'

export default {
  mixins: [mixins],
  data () {
    return {
      columns: [
        {
          name: 'type_str',
          required: true,
          label: 'Пополнение/Списание',
          align: 'left',
          field: 'type_str',
          sortable: true
        },
        {
          name: 'desc_str',
          required: true,
          label: 'Действие',
          align: 'left',
          field: 'desc_str',
          sortable: true
        },
        {
          name: 'value',
          required: true,
          label: 'Сумма',
          align: 'center',
          field: 'value',
          sortable: true
        },
        {
          name: 'dt_create',
          required: true,
          field: 'dt_create',
          label: 'Дата',
          align: 'center',
          format: val => date.formatDate(val, 'DD.MM.YYYY HH:mm'),
          sortable: false
        }
      ]
    }
  },
  beforeMount () {
    this.getData('transaction')
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
  .q-table tbody tr td.green{
    background: #90ff9033;
  }
  .q-table tbody tr td.red{
    background: #ff90904a;
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
