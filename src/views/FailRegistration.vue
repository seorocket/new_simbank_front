<template lang="pug">
      q-dialog(persistent v-model="dialog")
        q-card(style="width: 400px; height: 200px;")
          q-card-section(class="row items-center" style="justify-content: center;")
            span(class="q-ml-sm text-h6") Ошибка при регистрации!
            router-link(:to="{name: 'GOIP'}")
              q-btn(
                :ripple="false"
                color="primary"
                label="На главную"
                no-caps
                size="22px"
                upper
                class="enter_button"
              )
</template>
<script>

export default {
  data () {
    return {
      dialog: true
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