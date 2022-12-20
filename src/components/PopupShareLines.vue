<template lang="pug">
  q-card(v-if="data.active")
    q-card-section(class="row items-center")
      span(class="q-ml-sm text-h6") {{ title }}
    q-card-section(class="row items-center")
      template(v-for="g in gateways")
        div {{ g.name }}
        div
          span(v-for="l in g.lines")
            q-checkbox(v-model="selection[g.name]" :val="l" :label="l" color="teal")
      q-btn(
        flat
        :loading="data.submitting"
        label="Изменить"
        color="secondary"
        @click="convertData()"
      )
        template(v-slot:loading)
          q-spinner-facebook
      q-btn(
        flat
        label="Отмена"
        color="primary"
        v-on:click="$emit('close', model)"
      )
</template>

<script>
export default {
  name: "PopupShareLines",
  props: ['title', 'submit', 'model', 'data', 'gateways', 'userdata'],
  data() {
    return {
      selection: this.userdata
    }
  },
  methods: {
    convertData() {
      console.log(666)
      this.submit('/employee/share-gateway-lines', {}, 'share_lines')
    }
  }
}
</script>
