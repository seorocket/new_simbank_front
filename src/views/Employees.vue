<template lang="pug">
  div
    q-card
      q-card-actions
        q-btn(
          :ripple="false"
          color="secondary"
          label="Добавить сотрудника"
          v-on:click="openPopup('smb_server')"
          no-caps
        )
      q-separator
      q-card-section
        q-table(
          title="Сотрудники"
          :data="model.smb_server.data"
          :columns="columns"
          v-slot:body="props"
          :rows-per-page-options="[0]"
          row-key="name"
          hide-bottom
        )
          q-tr(:props="props")
            q-td(key="name" :props="props" v-html="props.row.name")
            q-td(key="server" :props="props" v-html="props.row.server")
            q-td(key="datetime" :props="props" v-html="props.row.datetime")
            q-td(key="actions" :props="props")
              q-btn(
                size="sm"
                round color="secondary"
                icon="edit"
                style="margin-right: 10px;"
                v-on:click="openPopup('smb_server', props.row.id)"
                )
              q-btn(size="sm" round color="deep-orange" icon="delete" @click="deleteItem(props.row.id, 'smb_server')")
</template>

<script>
import mixins from "../plugins/general"

export default {
  mixins: [mixins],
  data () {
    return {
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

  },
  beforeMount () {
    this.getData('employees')
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
