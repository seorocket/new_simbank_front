<template lang="pug">
  div
    div.row
      div.col-md-2.q-pa-md
        q-btn(
          :ripple="false" 
          color="secondary" 
          style="margin-left: 10px;" 
          label="Создать заявку" 
          no-caps
          v-on:click="popup.create_task = true")
        tbody
          tr(v-for="t in tasks")
            td {{ t.name }}
            td
              q-btn(size="sm" round color="deep-greeb" label="Посмотреть заявку" v-on:click="sumbit(`/task_message/${t.pk}/`)")          
    q-dialog(
      v-model="popup.create_task"
      persistent
      )
      q-card
        q-card-section(class="row items-center")
          span(class="q-ml-sm text-h6") Создание заявки
        q-card-section(class="row items-center")
            q-input(
              label="Заголовок заявки"
              :value="text"
              v-model="task.title"
              style="width: 100%")
        q-card-section(class="row items-center")
            q-input(
              label="Вопрос"
              :value="text" 
              v-model="task.quest"
              style="width: 100%")
        q-card-section(class="row items-center")
            q-btn(
              flat
              label="Создать"
              color="primary"
              v-if="popup.create_task"
              v-on:click="sendQuest()"
              )
            q-btn(
              flat
              label="Отмена"
              color="primary"
              v-on:click="popup.get_task = false"
              )    
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
       tasks: [],
       get_task: [],
       popup: {
         get_task: false,
         create_task: false,
       },
       task: {
        quest: '',
        title: '',
        task_id: null,
      },
    }
  },
  methods: {
    sumbit (url) {
      const vm = this
      axios.get(url).then(response => {
        vm.get_task = response.data
      })
    },
    sendQuest() {
      const vm = this
      if(vm.task.task_id === null){
        axios.post('/goip/goip_create/', vm.task).then(response => {
            vm.popup.create_task = false
            vm.popup.get_task = false
            console.log(response)
            vm.showNotify('top-right', 'Заявка добавлена!', 'positive')          
        })
       }else{
         axios.post('/goip/goip_create/', vm.task).then(response => {
            vm.popup.create_task = false
            vm.popup.get_task = false
            console.log(response)
            vm.showNotify('top-right', 'Заявка добавлена!', 'positive')
        })
       }
    },
    getData () {
        const vm = this
        axios.get('task_message/').then(response => {
            vm.tasks = response.data
        })
    },
  },
  beforeMount() {
   const vm = this
   vm.getData()
  }
}
</script>
