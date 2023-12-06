<template lang="pug">
  q-card(v-if="data.active")
    q-card-section(class="row items-center")
      span(class="q-ml-sm text-h6") {{ title }}
      div {{user_slots_data}}
    q-card-section(class="row items-center")
      template(v-for="g in smb")
        div {{ g.name }}
        div
          span(v-for="l in g.slots")
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
        data.push({'name': i, 'lines': this.user_slots_data[i]})
      }
      this.submit(`/employee/${this.edit_user_id}/share-smb-slots/`, {'data': {'data': data, 'type': 'custom'}}, 'share_slots', 'employee')
    }
  }
}
</script>













<!--<template lang="pug">-->
<!--  q-card(v-if="data.active")-->
<!--    q-card-section(class="row items-center")-->
<!--      span(class="q-ml-sm text-h6") {{ title }}-->
<!--    q-card-section(class="row items-center")-->
<!--      template(v-for="g in smb")-->
<!--        div-->
<!--          q-checkbox(v-model="selected_smb" :val="g.id" :label="g.name" color="teal")-->
<!--      div(style="width: 100%")-->
<!--        q-btn(-->
<!--          flat-->
<!--          :loading="data.submitting"-->
<!--          label="Изменить"-->
<!--          color="secondary"-->
<!--          @click="changeAvailableSlots()"-->
<!--        )-->
<!--          template(v-slot:loading)-->
<!--            q-spinner-facebook-->
<!--        q-btn(-->
<!--          flat-->
<!--          label="Отмена"-->
<!--          color="primary"-->
<!--          v-on:click="$emit('close', model)"-->
<!--        )-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  name: "PopupShareSlots",-->
<!--  props: ['title', 'submit', 'model', 'data', 'smb', 'user_slots_data', 'edit_user_id'],-->
<!--  data() {-->
<!--    return {-->
<!--      selected_smb: JSON.parse(JSON.stringify(this.user_slots_data))-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    changeAvailableSlots() {-->
<!--      this.submit(`/employee/${this.edit_user_id}/share-smb-slots/`, {'data': {'data': this.selected_smb, 'type': 'custom'}}, 'share_slots', 'employee')-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->
