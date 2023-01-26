<template lang="pug">
  q-card(v-if="data.active")
    q-card-section(class="row items-center")
      span(class="q-ml-sm text-h6") {{ data.update ? 'Изменить' : 'Создать' }} {{ title }}
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
        q-input(
          v-if="field.type === 'text'"
          v-model="field.value"
          :label="field.label"
          type="textarea"
          lazy-rules
          outlined
          stack-label
          style="width: 100%; margin-bottom: 10px"
        )
      q-btn(
        flat
        :label="data.update ? 'Изменить' : 'Создать'"
        color="primary"
        @click="submit(data.scheme, model, data.update, data.success_message)"
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
  name: "PopupCreateUpdate",
  props: ['title', 'submit', 'model', 'data', 'settings'],
  data() {
    return {}
  }
}
</script>
