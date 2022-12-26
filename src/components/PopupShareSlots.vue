<template lang="pug">
  q-card(v-if="data.active")
    q-card-section(class="row items-center")
      span(class="q-ml-sm text-h6") {{ title }}
    q-card-section(class="row items-center")
      template(v-for="g in smb")
        div {{ g.name }}
        div
          span(v-for="l in g.lines")
            q-checkbox(v-model="user_slots_data[g.name]" :val="l" :label="l" color="teal")
      q-btn(
        flat
        :loading="data.submitting"
        label="Изменить"
        color="secondary"
        @click="changeAvailableSlots()"
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
  name: "PopupShareSlots",
  props: ['title', 'submit', 'model', 'data', 'smb', 'user_slots_data', 'edit_user_id'],
  data() {
    return {}
  },
  methods: {
    changeAvailableSlots() {
      let data = []
      for (let i in this.user_slots_data) {
        data.push({'name': i, 'slots': this.user_slots_data[i]})
      }
      this.submit(`/employee/${this.edit_user_id}/share-smb-slots/`, {'data': {'data': data, 'type': 'custom'}}, 'share_slots', 'employee')
    }
  }
}
</script>
