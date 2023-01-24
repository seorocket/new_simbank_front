<template lang="pug">
      q-dialog(persistent v-model="dialog")
        q-card(style="width: 400px;")
          q-card-section(class="row items-center" style="justify-content: center;")
            span(class="q-ml-sm text-h6") Пополнение баланса
          q-card-section(class="row items-center" style="justify-content: center;")
            q-input(
              v-model="pay_data.username"
              label="Ваш логин"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-input(
              v-model="pay_data.value"
              label="Сумма платежа"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
          q-card-section(class="row items-center" style="justify-content: center;")
            router-link(:to="{name: 'GOIP'}")
              q-btn(
                :ripple="false"
                color="primary"
                label="Назад"
                no-caps
                size="15px"
                upper
                class="enter_button"
              )
            q-btn(
              :loading="loading"
              :ripple="false"
              color="secondary"
              label="Пополнить"
              no-caps
              size="15px"
              upper
              class="enter_button"
              style="margin-left: 20px;"
              @click="makePayment()"
            )
              template(v-slot:loading)
                q-spinner-facebook
</template>
<script>
import mixins from "../plugins/general";
import axios from 'axios'

export default {
  mixins: [mixins],
  data () {
    return {
      loading: false,
      dialog: true,
      pay_data: {
        username: '',
        value: 500
      }
    }
  },
  methods: {
    makePayment() {
      const vm = this
      vm.loading = true
      if (!vm.loading) {
        axios.post('top-up-balance/', vm.pay_data).then(response => {
          vm.showNotify(
              'top-right',
              response.message,
              response.code === 200 ? 'positive' : 'negative'
          )
          console.log(response.data, response.data.data.url)
          window.location.href = response.data.data.url
        })
      }
    }
  }
}
</script>
<style scoped>
  .router-link-active {
    text-decoration: none;
  }
  .enter_button {
    margin-top: 30px;
  }
</style>