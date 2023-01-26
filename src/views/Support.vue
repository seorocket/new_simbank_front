<template lang="pug">
  div
    q-card
      q-card-actions
        q-btn(
          :ripple="false"
          color="secondary"
          label="Создать обращение"
          v-on:click="openPopup('ticket')"
          no-caps
        )
      q-separator
      q-card-section
        q-table(
          title="Список обращений"
          :data="model.ticket.data"
          :columns="columns"
          :rows-per-page-options="[0, 50, 100]"
          row-key="id"
          @row-click="openTicket"
        )
    <!-- popups -->
    q-dialog(
      v-model="popup.active"
      persistent
      )
      <!-- Шлюз -->
      PopupCreateUpdate(
        title="обращение в поддержку"
        :submit="createObject"
        :data="popup.ticket"
        model="ticket"
        :settings="settings"
        @close="closePopup"
      )
</template>

<script>
import mixins from "../plugins/general"
import PopupCreateUpdate from "@/components/PopupCreateUpdate.vue";
import {date} from 'quasar'

export default {
  mixins: [mixins],
  components: {
    PopupCreateUpdate
  },
  data () {
    return {
      columns: [
        {
          name: 'id',
          required: true,
          label: 'Номер заявки',
          align: 'left',
          field: 'id',
          sortable: true
        },
        {
          name: 'name',
          required: true,
          label: 'Тема',
          align: 'left',
          field: 'name',
          sortable: true
        },
        {
          name: 'resolved',
          required: true,
          label: 'Обработано',
          align: 'left',
          field: 'resolved',
          format: val => val ? 'Да': 'Нет',
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
        },
      ]
    }
  },
  methods: {
    openTicket (event, row) {
      this.$router.push({path: `/support/${row.id}`, params: { id: row.id }})
    }
  },
  beforeMount () {
    this.getData('ticket')
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
