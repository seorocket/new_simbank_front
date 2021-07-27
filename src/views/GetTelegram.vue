<template lang="pug">
  div
    div.row
      div.q-pa-md
        div( v-html="dataContent")
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
       dataContent: '',
    }
  },
  methods: {
  },
  beforeMount() {
   const vm = this
      axios.get('telegram_page/').then(response => {
         vm.dataContent = response.data.message.content
      })
  }
}
</script>
