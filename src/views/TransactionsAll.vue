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
          title="Список пользователей"
          :data="model.client.data"
          :columns="columns"
          :rows-per-page-options="[0]"
          row-key="id"
        )
          template(v-slot:body="props")
            q-tr(:props="props" @click="openTicket(props.row)")
              q-td(key="username" :props="props" v-html="props.row.username")
              q-td(key="balance" :props="props" v-html="props.row.balance + ' ₽'")
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
          name: 'username',
          label: 'Логин',
          align: 'left',
          sortable: true,
          field: 'username'
        },
        {
          name: 'balance',
          field: 'balance',
          label: 'Баланс',
          align: 'left',
          sortable: true
        }
      ]
    }
  },
  methods: {
    openTicket (event) {
      this.$router.push({path: `/transactions/all/${event.id}`, params: { id: event.id }})
    },
    formatDate(dateStr) {
      const extractedDate = date.formatDate(dateStr, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
      return date.formatDate(extractedDate, 'DD.MM.YYYY HH:mm');
    }
  },
  beforeMount () {
    this.getData('client', 'view_clients=all')
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
  .q-table tbody tr {
    cursor: pointer;
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
