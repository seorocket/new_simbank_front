<template lang="pug">
  div(style="margin-bottom: 50px;")
    q-btn(
      :ripple="false"
      color="secondary"
      label="Назад"
      v-on:click="$router.go(-1)"
      no-caps
      style="margin-bottom: 15px;"
    )
    q-card
      q-card-section
        div(class="problem-title") Проблема:
        q-list(bordered class="rounded-borders" style="width: 100:")
          q-item(clickable v-ripple)
            q-item-section(avatar)
              q-item-label(lines="1" class="text-weight-bold") № {{ ticket.id }} - {{ ticket.name }}
          q-separator(inset="item")
          q-item(clickable v-ripple)
            q-item-section(avatar)
              q-item-label(lines="1") Сообщение: {{ ticket.message }}
          q-separator(inset="item")
          q-item(clickable v-ripple)
            q-item-section(avatar)
              q-item-label(lines="1") Дата: {{ ticket.dt_create }}
      q-separator
      q-card-section
        div(class="problem-title") Переписка:
        q-list(bordered class="rounded-borders" style="width: 100%;")
          template(v-for="m in model.ticket_message.data")
            q-item(clickable v-ripple)
              q-item-section(avatar)
                q-item-label(lines="1") {{ !m.is_admin ? 'Вы' : 'Техподдержка' }}
                q-item-label(caption lines="2")
                  span(class="text-weight-bold") {{ m.message }}
              q-item-section(side top) {{ m.dt_create_str }}
            q-separator(inset="item")
        q-input(
          v-model="message"
          label="Новое сообщение"
          type="textarea"
          lazy-rules
          outlined
          stack-label
          style="width: 100%; margin: 10px 0"
        )
        q-btn(
          flat
          label="Отправить"
          color="primary"
          @click="createMessage"
        )
</template>

<script>
import mixins from "../plugins/general"
import {date} from 'quasar'

export default {
  mixins: [mixins],
  data () {
    return {
      ticket: {
        id: '',
        name: '',
        message: '',
        dt_create: ''
      },
      message: ''
    }
  },
  methods: {
    createMessage () {
      let vm = this
      if (vm.message) {
        vm.createObject(
            {'ticket': {'value': vm.$route.params.id},
              'message': {'value': vm.message}},
            'ticket_message',
            false,
            'Сообщение отправлено!',
            `ticket=${vm.$route.params.id}`
        )
        vm.message = ''
      } else {
        vm.showNotify('top-right', 'Введите текст сообщения', 'negative')
      }
    }
  },
  beforeMount () {
    let vm = this
    vm.getData('ticket', '', vm.$route.params.id).then(data => {
      vm.ticket = data
      vm.ticket.dt_create = date.formatDate(vm.ticket.dt_create, 'DD.MM.YYYY HH:mm')
    })
    vm.getData('ticket_message', `ticket=${vm.$route.params.id}`)
  }
}
</script>
<style scoped>
  .problem-title {
    margin-bottom: 13px;
    margin-left: 3px;
    font-weight: 400;
    font-size: 17px;
  }
  .q-separator {
    margin-left: 0;
  }
  .text-h5 {
    margin: 5px 12px;
  }
</style>
