<template lang="pug">
  div
    q-card
      q-card-actions
        q-btn(
          :ripple="false"
          color="secondary"
          label="Назад"
          v-on:click="$router.go(-1)"
          no-caps
        )
      q-separator
      q-card-section
        q-table(
          :title="model.client.data.username ? 'Список транзакций пользователя ' + model.client.data.username : 'Список транзакций пользователя'"
          :data="model.transaction.data"
          :columns="columns"
          dense
          :rows-per-page-options="[25, 50, 100, 0]"
          no-data-label="Транзакции не найдены"
        )
          template(v-slot:body="props")
            q-tr(:props="props" :class="[props.row.type ? 'green' : 'red', props.row.cancelled ? 'bearded' : '']")
              q-td(key="type_str" :props="props" v-html="getTypeStr(props.row)")
              q-td(key="desc_str" :props="props" v-html="props.row.desc_str")
              q-td(key="value" :props="props" v-html="props.row.value + ' ₽'")
              q-td(key="dt_create" :props="props" v-html="formatDate(props.row.dt_create)")
              q-td(key="actions" :props="props")
                q-btn(
                  size="sm"
                  round color="red"
                  icon="close"
                  v-on:click="cancelledTransactionItem(props.row.id, 'transaction', 'view_transactions=all', user)"
                  v-if="!props.row.cancelled"
                )
</template>

<script>
import mixins from "../plugins/general"
import {date} from 'quasar'
import { mapState } from 'vuex';

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
          label: 'Описание',
          align: 'left',
          field: 'desc_str',
          sortable: true
        },
        {
          name: 'value',
          required: true,
          label: 'Сумма',
          align: 'left',
          field: 'value',
          sortable: true
        },
        {
          name: 'dt_create',
          required: true,
          field: 'dt_create',
          label: 'Дата',
          align: 'center',
          sortable: false
        },
        {
          name: 'actions',
          label: 'Действие',
          align: 'center',
          sortable: false
        }
      ]
    }
  },
  computed: {
    ...mapState([
      'user'
    ])
  },
  methods: {
    getTypeStr(row) {
      let str = row.type_str;

      if (row.client_edit) {
        str += ` (${row.client_edit_str})`;
      }

      if (row.cancelled) {
        str += ` (отменено: ${row.client_cancelled_str})`;
      }

      return str;
    },
    formatDate(dateStr) {
      const extractedDate = date.formatDate(dateStr, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
      return date.formatDate(extractedDate, 'DD.MM.YYYY HH:mm');
    }
  },
  beforeMount () {
    let vm = this
    this.getData('transaction', `client=${vm.$route.params.id}&view_transactions=all`)
    this.getData('client', 'view_clients=all', vm.$route.params.id)
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
  .q-table tbody tr.green{
    background: #90ff9033;
  }
  .q-table tbody tr.red{
    background: #ff90904a;
  }
  .q-table tbody tr.bearded{
    background: rgba(255, 200, 144, 0.29);
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
