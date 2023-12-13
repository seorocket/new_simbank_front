<template lang="pug">
  div
    q-card
      q-card-actions
        q-btn(
          :ripple="false"
          color="secondary"
          style="margin: 15px 0 10px 10px;"
          label="Пересканировать SIM"
          no-caps
          v-on:click="uploadSim()")

        q-btn(
          :ripple="false"
          color="red"
          style="margin: 15px 0 10px 10px;"
          label="Удалить выбранные SIM"
          no-caps
          v-on:click="massDeleteSim()")

        q-input(
          outlined
          v-model="search"
          label="Поиск по номеру"
          style="width: 300px;"
          class="on-right"
        )
      q-separator
      q-card-section
        q-table(
          row-key="name"
          title="Список номеров"
          :data="model.sim.data"
          :columns="columns"
          v-slot:body="props"
          selection="multiple"
          :selected.sync="selected"
          :rows-per-page-options="[0]"
        )
          q-tr(:props="props")
            q-td(key="selected" align="center")
              q-checkbox(dense v-model="props.selected")
            q-td(key="status" align="center")
              div.green_circle(v-if="props.row.status === true")
              div.red_circle(v-else)
            q-td(key="smb_slot" :props="props" v-html="props.row.smb_slot")
            q-td(key="name" :props="props")
              <img :src="props.row.operator_image" style="position: relative; top: 2px; right: 3px;"> {{ props.row.name }}
            q-td(key="imei" :props="props") -
            q-td(key="goip_slot" :props="props" v-html="props.row.goip_slot ? props.row.goip_slot : '-' ")
            q-td(key="actions" :props="props")
              q-btn.q-mr-sm(
                size="sm"
                color="secondary"
                label="Активировать"
                v-on:click="openActivateSim('activate_sim', props.row.id)"
              )
              q-btn(
                size="sm"
                round color="secondary"
                icon="edit"
                style="margin-right: 10px;"
                v-on:click="openPopup('sim', props.row.id)"
                )
              q-btn(size="sm" round color="deep-orange" icon="delete" v-on:click="deleteItem(props.row.id, 'sim')")
    <!-- popups -->
    q-dialog(
      v-model="popup.active"
      persistent
      )
      <!-- Обновление сим -->
      PopupCreateUpdate(
        title="настройки GOIP шлюза"
        :submit="createObject"
        :data="popup.sim"
        model="sim"
        :settings="settings"
        @close="closePopup"
      )
      <!-- Активация сим -->
      PopupActivateSim(
        title="Активировать SIM-карту"
        :submit="actionRequest"
        :data="popup.activate_sim"
        model="activate_sim"
        :settings="settings"
        @close="closePopup"
      )

</template>

<script>
import axios from 'axios'
import mixins from "../plugins/general"
import PopupCreateUpdate from "../components/PopupCreateUpdate"
import PopupActivateSim from "../components/PopupActivateSim"

export default {
  mixins: [mixins],
  components: {
    PopupCreateUpdate,
    PopupActivateSim
  },
  data() {
    return {
      selected: [],
      data_tmp: [],
      search: '',
      columns: [
        {
          name: 'status',
          label: 'Статус Sim',
          align: 'center',
          sortable: true,
          field: 'status'
        },
        {
          name: 'smb_slot',
          field: 'smb_slot',
          label: 'Слот в Sim-Банке',
          align: 'center',
          sortable: true
        },
        {
          name: 'name',
          field: 'name',
          label: 'Номер',
          align: 'left',
          sortable: true
        },
        {
          name: 'imei',
          label: 'IMEI',
          align: 'center',
          sortable: false
        },
        {
          name: 'goip_slot',
          label: 'Используется',
          field: 'goip_slot',
          align: 'center',
          sortable: true
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
    massDeleteSim() {
      const vm = this
      let data = {'ids': vm.selected.map(item => item.id)}
      vm.$q.dialog({
        title: 'Подтвердите действие',
        message: 'Вы точно хотите удалить эти Sim карты?',
        ok: {
          push: true
        },
        cancel: {
          push: true,
          color: 'negative'
        },
        persistent: true
      }).onOk(() => {
        axios.post('/sim/delete/', data).then(response => {
          console.log(response)
          vm.showNotify('top-right', `Удалено ${response.data.deleted} Sim карт`, 'positive')
          vm.getData('sim')
        })
      })
    },
    uploadSim() {
      const vm = this
      axios.post('/sim/upload_sim/').then(response => {
        vm.showNotify('top-right', `Добавленно ${response.data.created} Sim карт`, 'positive')
        this.getData('sim')
      })
    },
    openActivateSim(type, id) {
      const vm = this
      vm.getData('gateway_lines')
      vm.popup.active = vm.popup[type].active = true
      vm.popup[type].scheme.sim.value = id
    }
  },
  watch: {
    'search'(event) {
      const vm = this
      if (!vm.data_tmp.length) {
        vm.data_tmp = vm.model.sim.data
      }
      if (event !== '') {
        vm.model.sim.data = vm.data_tmp.filter(item => item.name.toLowerCase().indexOf(event.toLowerCase()) > -1)
      } else {
        vm.model.sim.data = vm.data_tmp
      }
    }
  },
  mounted() {
    this.getData('smb')
    this.getData('operator')
    this.getData('sim')
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
