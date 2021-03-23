<template lang="pug">
  div( v-html="dataContent")
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
       dataContent: 'kkk',
    }
  },
  methods: {
  },
  beforeMount() {
   const vm = this
      axios.get('faq_page/').then(response => {
         vm.dataContent = response.data.message.content
      })
  }
}
</script>
