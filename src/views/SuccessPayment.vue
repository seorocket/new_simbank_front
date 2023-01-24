<template lang="pug">
      q-dialog(persistent v-model="dialog")
        q-card(style="width: 400px;")
          q-card-section(class="row items-center" style="justify-content: center;")
            span(class="q-ml-sm text-h6") Успешная оплата!
          q-card-section(class="row items-center" style="justify-content: center;")
            q-icon(name="task_alt" size="4rem" color="green")
          q-card-section(class="row items-center" style="justify-content: center;")
            router-link(:to="{name: 'GOIP'}")
              q-btn(
                :ripple="false"
                color="primary"
                label="На главную"
                no-caps
                size="15px"
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