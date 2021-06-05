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
      div.col-md-12.q-pa-md
        table.table
          thead
            tr
              th ID
              th Название заявки
              th Статус заявки
              th Действие
          tbody
            tr(v-for="t in tasks")
              td {{ t.pk }}
              td {{ t.name }}
              td
                div(v-if="t.newmessage === true" style="color:green; font-weight:600") Новое сообщение
                div(v-if="t.newmessage === false" style="color:blue; font-weight:600") Новых сообщений нет
              td
                q-btn(size="sm" color="green" round icon="visibility" v-on:click="sumbit(`/task_message/${t.pk}/`)")
                q-btn(size="sm" round color="deep-orange" icon="delete" v-on:click="sumbitDelete(`/task_message/${t.pk}/`)")          
    q-dialog(
      v-model="popup.get_task"
      persistent
      )
      q-card(style="max-width: 1500px;width:1000px")
        q-card-section(class="row items-center")
          span(class="q-ml-sm text-h6") Ответы на заявку
        q-card-section(class="row items-center")
          div(class="col-12" v-for="t in get_task.message")
            div(:class="t.quest? 'text-right': 'text-left'") 
              div(v-if="t.quest === true" style="color:green; font-weight:600") Вы
              div(v-if="t.quest === false" style="color:blue; font-weight:600") Администратор
              div {{ t.text }}
        q-card-section(class="row items-center")
            q-input(
              label="Ответ"
              :value="text"
              type="textarea"
              v-model="task.text"
              style="width: 100%")
        q-card-section(class="row items-center")
            q-btn(
              flat
              label="Создать"
              color="primary"
              v-if="popup.get_task"
              v-on:click="sendQuest()"
              )
            q-btn(
              flat
              label="Отмена"
              color="primary"
              v-on:click="popup.get_task = false; task.task_id = null; getData()"
              )
    q-dialog(
      v-model="popup.create_task"
      persistent
      )
      q-card(style="max-width: 1500px;width:1000px")
        q-card-section(class="row items-center")
          span(class="q-ml-sm text-h6") Создание заявки
        q-card-section(class="row items-center")
            q-input(
              label="Заголовок заявки"
              :value="text"
              v-model="task.name"
              style="width: 100%")
        q-card-section(class="row items-center")
            q-input(
              label="Вопрос"
              :value="text" 
              type="textarea"
              v-model="task.text"
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
              v-on:click="popup.create_task = false; getData()"
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
        text: '',
        name: '',
        task_id: null,
      },
    }
  },
  methods: {
    sumbit (url) {
      const vm = this
      axios.get(url).then(response => {
        vm.get_task = response.data
        vm.task.task_id = response.data.pk
        vm.popup.get_task = true
      })
    },
    sumbitDelete (url) {
      const vm = this
      vm.$q.dialog({
        title: 'Подтвердите действие',
        message: 'Вы точно хотите удалить эти настройки?',
        ok: {
          push: true
        },
        cancel: {
          push: true,
          color: 'negative'
        },
        persistent: true
      }).onOk(() => {
        vm.deleteObject(url)
      })
    },
    deleteObject (url, url_callback=false, path=false) {
        const vm = this
        axios.delete(url).then(response => {
          if (response.status === 204) {
            if ( url_callback && path ) {
                vm.getData()
            }
            vm.getData()
            vm.showNotify('top-right', 'Заявка удалена!', 'negative')
          }
        })
    },
    sendQuest() {
      const vm = this
      if(vm.task.task_id === null){
        axios.post('task_message/', vm.task).then(response => {
            vm.popup.create_task = false
            vm.popup.get_task = false
            console.log(response)
            vm.getData()
            vm.showNotify('top-right', 'Заявка добавлена!', 'positive')          
        })
       }else{
         axios.post('task_message/add_massege/', vm.task).then(response => {
            vm.popup.create_task = false
            vm.popup.get_task = false
            console.log(response)
            vm.getData()
            vm.showNotify('top-right', 'Заявка добавлена!', 'positive')
        })
       }
    },
    getData () {
        const vm = this
        axios.get('task_message/').then(response => {
            vm.tasks = response.data
            vm.task.text = ''
            vm.task.name = ''
            vm.task_id = null
        })
    },
  },
  beforeMount() {
   const vm = this
   vm.getData()
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
