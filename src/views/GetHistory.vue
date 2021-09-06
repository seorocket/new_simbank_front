<template lang="pug">
  div
    div.row
      div.col-md-12.q-pa-md
        table.table
          thead
            tr
              th Заголовок
              th Что изменено
              th Дата
          tbody
            tr(v-for="t in tasks")
              td {{ t.name }}
              td( v-html="t.content")
              td {{t.time}}
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      tasks: [],
    }
  },
  methods: {
  },
  beforeMount() {
   const vm = this
      axios.get('history_page/').then(response => {
         vm.tasks = response.data
      }).catch(error => {
       if(error.response.status == 403){
         vm.showNotify('top-right', 'Пополните баланс!', 'negative')
         vm.$store.dispatch('authorize', '')
        }
       })
  }
}
</script>
<style scoped>
  .table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  .table th {
    font-weight: normal;
    font-size: 15px;
    text-transform: uppercase;
    background: #e6e3da;
    padding: 10px;
  }
  .table tbody tr td, .table tbody tr th {
    text-align: center;
    padding: 5px 8px;
    border-bottom: 1px solid #ddd;
  }
  .table tbody tr:nth-child(even) td{
    background: #eee;
  }
  .page_title_divider {
    text-align: center;
    min-width: 1px;
    max-width: 100%;
    font-size: 21px;
    font-weight: normal;
    letter-spacing: 0.01em;
    color: #fff;
    background: #027BE3;
    line-height: 50px;
    opacity: 0.9;
    box-shadow: 0 2px 8px -3px rgb(0 0 0);
    margin: 20px 0;
  }
  .green_circle {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: green;
    display: inline-block;
  }
  .red_circle {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: red;
    display: inline-block;
  }
pre {
    background: #e5f1ff;
    padding: 10px;
    width: 100%;
  }
  h1 {
    font-size: 2rem;
    font-weight: bold;
  }
  h2 {
    font-size: 1.75rem;
  }
  h3 {
    font-size: 1.4rem;
  }
</style>
