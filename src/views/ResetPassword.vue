<template lang="pug">
      q-dialog(persistent v-model="dialog")
        q-card(style="width: 400px;")
          q-card-section(class="row items-center" style="justify-content: center;")
            span Для сброса пароля укажите вашу почту
          q-card-section(class="row items-center" style="justify-content: center;")
            q-input(
              v-model="email"
              label="Почта"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )
            q-btn(
              :ripple="false"
              color="primary"
              label="Сбросить пароль"
              no-caps
              size="12px"
              upper
              class="enter_button"
              style="margin-right: 10px"
            )
            router-link(:to="{name: 'GOIP'}")
              q-btn(
                :ripple="false"
                color="primary"
                label="На главную"
                no-caps
                flat
                size="12px"
                upper
                class="enter_button"
              )
</template>
<script>
import mixins from "../plugins/general";

export default {
  mixins: [mixins],
  data () {
    return {
      dialog: true,
      email: ''
    }
  },
  methods: {
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