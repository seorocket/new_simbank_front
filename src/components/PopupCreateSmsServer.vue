<template lang="pug">
  q-card(v-if="data.create_server.active")
    q-card-section(class="row items-center")
      span(class="q-ml-sm text-h6") {{ title }}
    q-card-section(class="row items-center")
      span(class="q-ml-sm q-pb-sm") 1. Cервер нужен для установки ПО Sсheduler Server. Эта утилита, позволяющая выполнять централизованное управление оборудованием.
      span(class="q-ml-sm q-pb-sm") 2. С помощью этого программного обеспечения SIMBank и GoIP будут зарегистрированы на сервере SIMBankScheduler. Используя Scheduler Server, можно одновременно управлять несколькими GSM-шлюзами и SIM-банками и управлять работой более чем 10 000 SIM-карт из веб-платформы Simbank.pro
      span(class="q-ml-sm q-pb-sm") 3. Подробнее о работе Sсheduler Server читайте в FAQ
      span(class="q-ml-sm q-pb-sm") 4. Стоимость аренды сервера  - 500 руб\мес.
      span(class="q-ml-sm q-pb-sm") 5. *плата за аренду сервера будет списываться с баланса аккаунта

      span(class="q-ml-sm q-pb-sm")
        u Если у вас есть свой СМС сервер
        span  нажмите кнопку "Свой сервер" и впишите свой адрес сервера
      q-btn(
        flat
        :loading="data.create_server.submitting"
        label="Создать"
        color="primary"
        @click="createServer()"
        )
        template(v-slot:loading)
          q-spinner-facebook
      q-btn(
        flat
        v-if="!data.create_server.submitting"
        label="Отмена"
        color="primary"
        v-on:click="$emit('close', model)"
        )
      q-btn(
        v-if="!data.create_server.submitting"
        flat
        label="Свой сервер"
        color="primary"
        @click="data.create_server.active = false; data.smb_server.active = true"
        )
</template>

<script>

export default {
  name: "PopupCreateSmsServer",
  props: ['title', 'model', 'data', 'submit'],
  data() {
    return {}
  },
  methods: {
    createServer () {
      this.submit('/scheduler/create-clo-server/', {}, 'create_server', 'smb_server')
    }
  }
}
</script>
