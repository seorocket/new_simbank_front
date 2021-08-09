<template lang="pug">
  div
    div.row
      div.q-pa-md
        div token: {{toks}}
        div( v-html="dataContent")
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
       dataContent: '',
       toks: '',
    }
  },
  methods: {
  },
  beforeMount() {
   const vm = this
      vm.toks = localStorage.token
      axios.get('api_page/').then(response => {
         vm.dataContent = response.data.message.content
      })
  }
}
</script>
<style>
pre{
    background: none repeat scroll 0 0 #eeeeee;
    border-left: 5px solid #027be3;
    border-right: 5px solid #027be3;
    color: #333333;
    font-style: italic;
    padding: 10px 20px;
    text-align: left;
    width: 100%;
    box-shadow: 0 0 5px #c0c0c0;
    max-width:1200px;
    width:100%;
}
</style>
