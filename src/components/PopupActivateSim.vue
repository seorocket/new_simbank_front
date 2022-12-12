<template lang="pug">
  q-card(v-if="data.active")
    q-card-section(class="row items-center")
      span(class="q-ml-sm text-h6") {{ title }} - {{ data.scheme.sim.value }}
    q-card-section(class="row items-center")
      template(v-for="field in data.scheme")
        q-select(
          v-if="field.type === 'select'"
          outlined
          v-model="field.value"
          :options="settings[field.options]"
          :label="field.label"
          stack-label
          style="width: 100%; margin-bottom: 10px"
        )
        q-input(
          v-if="field.type === 'input'"
          v-model="field.value"
          :label="field.label"
          type="text"
          lazy-rules
          outlined
          stack-label
          style="width: 100%; margin-bottom: 10px"
        )
      q-btn(
        flat
        label="Активировать"
        color="secondary"
        @click="submit()"
        )
      q-btn(
        flat
        label="Отмена"
        color="primary"
        v-on:click="$emit('close', model)"
        )
</template>

<script>

export default {
  name: "PopupActivateSim",
  props: ['title', 'submit', 'model', 'data', 'settings'],
  data() {
    return {}
  }
}
</script>
