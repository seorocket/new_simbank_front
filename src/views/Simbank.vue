<template lang="pug">
  div
    q-btn(
      :ripple="false" 
      color="secondary" 
      style="margin: 15px 0 0 10px;" 
      label="Добавить настройки Simbank" 
      no-caps
      v-on:click="popup.add_goip = true")
    table.table
      thead
        tr
          th Название
          th ID
          th Тип
          th Действие
      tbody
        tr
          td smb128_1
          td 1
          td 1
          td
            q-btn(size="sm" round color="secondary" icon="edit" style="margin-right: 10px;")
            q-btn(size="sm" round color="deep-orange" icon="delete")

    div.page_title_divider Sheduler Settings
    q-btn(
      :ripple="false" 
      color="secondary" 
      style="margin-left: 10px;" 
      label="Добавить настройки Sheduler" 
      no-caps
      v-on:click="popup.add_goip = true")
    table.table
      thead
        tr
          th Имя Sheduler
          th Логин
          th Адрес 
          th Действие
      tbody
        tr
          td onec
          td admin
          td http://178.140.95.91:4441
          td
            q-btn(size="sm" round color="secondary" icon="edit" style="margin-right: 10px;")
            q-btn(size="sm" round color="deep-orange" icon="delete")
    q-dialog(
      v-model="popup.add_goip"
      persistent
      )
      q-card
        q-card-section(class="row items-center")
          span(class="q-ml-sm text-h6") Добавить GOIP
        q-card-section(class="row items-center")
            q-input(
              v-model="popup.add_goip_data.name"
              label="Название GOIP"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-select(
              outlined
              v-model="popup.add_goip_data.sheduler" 
              :options="settings.sheduler" 
              label="Укажите Sheduler" 
              stack-label 
              style="width: 100%; margin-bottom: 10px"
            )
            q-input(
              v-model="popup.add_goip_data.goip_id"
              label="Укажите ID GOIP"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-input(
              v-model="popup.add_goip_data.server_password"
              label="Укажите пароль GOIP для сервера"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-select(
              outlined
              v-model="popup.add_goip_data.goip_slots" 
              :options="settings.goip_slots" 
              label="Укажите тип GOIP" 
              stack-label 
              style="width: 100%; margin-bottom: 10px"
            )
            q-input(
              v-model="popup.add_goip_data.url"
              label="Укажите url от GOIP"
              type="text"
              placeholder="http://9.9.9.9:4441"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-input(
              v-model="popup.add_goip_data.login"
              label="Логин от GOIP"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-input(
              v-model="popup.add_goip_data.password"
              label="Пароль от GOIP"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-input(
              v-model="popup.add_goip_data.url_sms_service"
              label="URL от SMS сервиса"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-btn(
              flat
              label="Продолжить"
              color="primary"
              )
            q-btn(
              flat
              label="Отмена"
              color="primary"
              v-on:click="popup.add_goip = false"
              )
</template>

<script>
export default {
  data () {
    return {
      popup: {
        add_goip: false,
        add_goip_data: {
          name: '',
          sheduler: {'label':'onec', 'value': 1},
          goip_id: '',
          server_password: '',
          goip_slots:'',
          url: '',
          login: '',
          password: '',
          url_sms_service: ''
        },
      },
      settings: {
        sheduler: [{'label':'onec', 'value': 1}],
        goip_slots: [
          {'label': '1', 'value': '1'},
          {'label': '4', 'value': '4'},
          {'label': '8', 'value': '8'},
          {'label': '16', 'value': '16'},
          {'label': '32', 'value': '32'}
        ]
      }
    }
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