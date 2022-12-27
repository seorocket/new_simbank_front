<template lang="pug">
  div
    q-card
      q-card-actions
        q-btn(
          :ripple="false"
          color="secondary"
          label="Добавить сотрудника"
          v-on:click="openPopup('employee')"
          no-caps
        )
      q-separator
      q-card-section
        q-table(
          title="Сотрудники"
          :data="model.employee.data"
          :columns="columns"
          v-slot:body="props"
          :rows-per-page-options="[0]"
          row-key="name"
          hide-bottom
        )
          q-tr(:props="props")
            q-td(key="username" :props="props" v-html="props.row.username")
            q-td(key="gateway_lines" :props="props")
              div(v-for="item in props.row.gateway_lines" class="item_chips")
                span(class="chips_title") {{ item.name }}:
                span(v-html="item.data.join(', ')")
              q-btn(
                v-if="props.row.id"
                size="xs"
                color="secondary"
                label="Изменить"
                style="margin-right: 10px;"
                @click="openShareLines(props.row)"
              )

            q-td(key="smb" :props="props")
              div(v-for="item in props.row.smb_slots" class="item_chips")
                span(class="chips_title") {{ item.name }}
              q-btn(
                v-if="props.row.id"
                size="xs"
                color="secondary"
                label="Изменить"
                style="margin-right: 10px;"
                @click="openShareSlots(props.row)"
              )
            q-td(key="actions" :props="props")
              q-btn(
                v-if="props.row.id"
                size="xs"
                color="secondary"
                label="Изменить пароль"
                style="margin-right: 10px;"
                @click="openChangePassword(props.row)"
              )
              q-btn(
                v-if="props.row.id"
                size="xs"
                color="deep-orange"
                label="Удалить"
                style="margin-right: 10px;"
                @click="deleteItem(props.row.id, 'employee')"
              )
    <!-- popups -->
    q-dialog(
      v-model="popup.active"
      persistent
      )
      <!-- Сотрудник -->
      PopupCreateUpdate(
        title="Данные сотрудника"
        :submit="createObject"
        :data="popup.employee"
        model="employee"
        :settings="settings"
        @close="closePopup"
      )
      <!-- Расшарить линии Гоипа -->
      PopupShareLines(
        title="Расшарить GOIP линии"
        :submit="actionRequest"
        v-bind:data="popup.share_lines"
        v-bind:gateways="model.gateway.data"
        v-bind:user_lines_data="user_lines_data"
        v-bind:edit_user_id="edit_user_id"
        model="share_lines"
        @close="closePopup"
      )
      <!-- Расшарить слоты Симбанка -->
      PopupShareSlots(
        title="Расшарить SMB слоты"
        :submit="actionRequest"
        v-bind:data="popup.share_slots"
        v-bind:smb="model.smb.data"
        v-bind:user_slots_data="user_slots_data"
        v-bind:edit_user_id="edit_user_id"
        model="share_slots"
        @close="closePopup"
      )
      PopupChangePassword(
        title="Изменить пароль пользователю:"
        :submit="actionRequest"
        :data="popup.change_password"
        model="change_password"
        :settings="settings"
        v-bind:edit_user_id="edit_user_id"
        v-bind:edit_username="edit_username"
        @close="closePopup"
      )
</template>

<script>
import mixins from "../plugins/general"
import { mapState } from 'vuex'
import PopupCreateUpdate from "@/components/PopupCreateUpdate.vue";
import PopupShareLines from "@/components/PopupShareLines.vue";
import PopupShareSlots from "@/components/PopupShareSlots.vue";
import PopupChangePassword from "@/components/PopupChangePassword.vue";

export default {
  mixins: [mixins],
  components: {
    PopupCreateUpdate,
    PopupShareLines,
    PopupShareSlots,
    PopupChangePassword
  },
  computed: {
    ...mapState([
      'user_id',
    ])
  },
  data () {
    return {
      user_lines_data: {},
      user_slots_data: [],
      edit_user_id: 0,
      edit_username: '',
      columns: [
        {
          name: 'username',
          required: true,
          label: 'Логин',
          align: 'left',
          field: 'username',
          sortable: true,
          headerStyle: 'width: 10%'
        },
        {
          name: 'gateway_lines',
          label: 'Доступные GOIP линии',
          align: 'left',
          headerStyle: 'width: 35%'
        },
        {
          name: 'smb',
          label: 'Доступные SMB слоты',
          align: 'left',
          headerStyle: 'width: 35%'
        },
        {
          name: 'actions',
          label: 'Действия',
          align: 'center',
          headerStyle: 'width: 20%'
        },
      ]
    }
  },
  methods: {
    openShareLines(item) {
      const vm = this
      vm.edit_user_id = item.id
      vm.user_lines_data = {}
      for(let i in vm.model.gateway.data) {
        // добавляем через $set чтобы элементы были реактивные
        vm.$set(vm.user_lines_data, vm.model.gateway.data[i].name, [])
      }
      for (let i in item.gateway_lines) {
        vm.user_lines_data[item.gateway_lines[i].name] = item.gateway_lines[i].data
      }
      vm.popup.active = vm.popup.share_lines.active = true
    },
    openShareSlots(item) {
      const vm = this
      vm.edit_user_id = item.id
      vm.user_slots_data = []
      vm.user_slots_data = item.smb_slots.map(item => item.data)
      vm.popup.active = vm.popup.share_slots.active = true
    },
    openChangePassword (item) {
      console.log(item.username)
      const vm = this
      vm.edit_user_id = item.id
      vm.edit_username = item.username
      vm.popup.active = vm.popup.change_password.active = true
    },
  },
  beforeMount () {
    this.getData('employee')
    this.getData('gateway')
    this.getData('smb')
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
  .item_chips {
    padding: 10px 0;
  }
  .item_chips .chips_title{
    padding: 5px;
    background: var(--q-color-primary);
    border-radius: 7px;
    margin-right: 5px;
    color: #fff;
  }
</style>
