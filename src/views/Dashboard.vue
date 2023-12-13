<template lang="pug">
  div
    q-card
      q-card-actions
        q-input(
          outlined
          v-model="search"
          label="Поиск по логину"
          style="width: 300px;"
          class="on-right"
        )
      q-separator
      q-card-section
        q-table(
          row-key="name"
          title="Информация"
          :data="model.client.data"
          :columns="columns"
          v-slot:body="props"
          :rows-per-page-options="[0]"
        )
          q-tr(:props="props")
            q-td(key="username" :props="props" v-html="props.row.username")
            q-td(key="balance" :props="props" v-html="props.row.balance + ' ₽'")
            q-td(key="date_joined" :props="props" v-html="formatDate(props.row.date_joined)")
            q-td(key="email" :props="props" v-html="props.row.email ? props.row.email : '-' ")
            q-td(key="actions" :props="props")
              q-btn.q-mr-sm(
                size="sm"
                color="secondary"
                label="Пополнить баланс"
                v-on:click="openPopup('client', props.row.id)"
              )
    <!-- popups -->
    q-dialog(
      v-model="popup.active"
      persistent
      )
      <!-- Обновление сим -->
      PopupTransaction(
        title="Пополнить баланс"
        :submit="createObjectTransaction"
        :data="popup.client"
        model="transaction"
        :settings="settings"
        @close="closePopup"
      )

</template>

<script>
import mixins from "../plugins/general"
import PopupTransaction from "../components/PopupTransaction"
import { date } from 'quasar'

export default {
  mixins: [mixins],
  components: {
    PopupTransaction
  },
  data() {
    return {
      selected: [],
      data_tmp: [],
      search: '',
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
        },
        {
          name: 'date_joined',
          field: 'date_joined',
          label: 'Дата создания',
          align: 'left',
          sortable: true
        },
        {
          name: 'email',
          label: 'Email',
          align: 'left',
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
  methods: {
    formatDate(dateStr) {
      const extractedDate = date.formatDate(dateStr, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
      return date.formatDate(extractedDate, 'DD.MM.YYYY HH:mm');
    }
  },
  watch: {
    'search'(event) {
      const vm = this
      if (!vm.data_tmp.length) {
        vm.data_tmp = vm.model.client.data
      }
      if (event !== '') {
        vm.model.client.data = vm.data_tmp.filter(item => item.username.toLowerCase().indexOf(event.toLowerCase()) > -1)
      } else {
        vm.model.client.data = vm.data_tmp
      }
    }
  },
  mounted() {
    this.getData('client', 'employer=null&view_clients=all')
  }
}
</script>
<style scoped>
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
@media(max-width: 768px) {
  .q-card__actions {
    display: flex;
    flex-direction: column;
  }
}
</style>
