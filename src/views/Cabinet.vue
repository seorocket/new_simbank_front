<template lang="pug">
  div
    q-btn(
      :ripple="false" 
      color="secondary" 
      style="margin-left: 10px;" 
      label="Добавить Пользователя" 
      no-caps
      v-on:click="popup.add_user = true")
    table.table
      thead
        tr
          th Имя пользователя
          th Действие
      tbody
        tr(v-for="s in user_settings")
          td {{ s.name }}
          td
            q-btn(size="sm" round color="secondary" icon="edit" style="margin-right: 10px;" v-on:click="openEdit('edit_user', s.name, s.pk, s.sim_list, s.goip_ports)")
            q-btn(size="sm" round color="deep-orange" icon="delete" v-on:click="deleteUser(s.pk)")

    q-dialog(
      v-model="popup.add_user || popup.edit_user"
      persistent
      )
      q-card
        q-card-section(class="row items-center")
          span(class="q-ml-sm text-h6") Добавить Сервер
        q-card-section(class="row items-center")           
            q-input(
              v-model="popup.add_user_data.username"
              label="Укажите логин юзера"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )            
            q-input(
              v-model="popup.add_user_data.password"
              label="Укажите пароль от юзера"
              type="text"
              lazy-rules
              outlined
              stack-label
              style="width: 100%; margin-bottom: 10px"
            )                       
            q-select(
              filled
              v-model="popup.add_user_data.goip_ports"
              multiple
              :options="goips"
              v-if="popup.edit_user"
              label="Goip"
              style="width: 100%; margin-bottom: 10px"
            )                                   
            q-select(
              filled
              v-model="popup.add_user_data.sim_list"
              multiple
              :options="sim_list"
              v-if="popup.edit_user"
              label="Sim список"
              style="width: 100%; margin-bottom: 10px"
            )
            q-btn(
              flat
              label="Создать"
              color="primary"
              v-if="popup.add_user"
              v-on:click="createUser(popup.add_user_data, '/user/create_employee/')"
              )
            q-btn(
              flat
              label="Изменить"
              color="primary"
              v-if="popup.edit_user"
              v-on:click="editUser(popup.add_user_data, `/user/edit_employee/`)"
              )

            q-btn(
              flat
              label="Отмена"
              color="primary"
              v-on:click="popup.add_user = popup.edit_user = false; popup.add_user_data.pk = ''"
              )
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      popup: {
        add_user: false,
        edit_user: false,
        add_user_data: {
          username: '',
          password: '',
          sim_list: [],
          goip_ports: [],
          pk: '',
        },
      },
      goips: [],
      sim_list: [],
      user_settings: [],
    }
  },
  methods: {      
    createUser (data, url,) {
        const vm = this
        axios.post(url, data).then(response => {
          if (response.status == 201 || response.status == 200) {       
            if(response.data['message'] == 'error'){
              vm.showNotify('top-right', 'Попробуйте изменить логин!', 'negative')
            }else{
                vm.showNotify('top-right', 'Пользователь добавлен!', 'positive')
                vm.getData()
            }
          }
          
        }).catch(error => {
       if(error.response.status == 403){
         vm.showNotify('top-right', 'Пополните баланс!', 'negative')
         vm.$store.dispatch('authorize', '')
        }
       })
    },  
    editUser (data, url) {
        const vm = this
        axios.post(url, data).then(response => {
          if (response.status == 201 || response.status == 200) {       
            if(response.data['message'] == 'error'){
              vm.showNotify('top-right', 'Попробуйте изменить логин!', 'negative')
            }else{
                vm.showNotify('top-right', 'Пользователь добавлен!', 'positive')
                vm.getData()
            }
          }          
        }).catch(error => {
       if(error.response.status == 403){
         vm.showNotify('top-right', 'Пополните баланс!', 'negative')
         vm.$store.dispatch('authorize', '')
        }
       })
    },  
    getData () {
        const vm = this
        axios.post('/user/get_employee/').then(response => {            
            vm.user_settings = response.data          
        })
        axios.get('/goip/').then(response => {
            let nameLengths = response.data.message.map(function(goip) {
                return goip.line_id;
            });
            vm.goips = nameLengths                        
        })        
        if (vm.popup.add_user_data.goip_ports.length == 0) {
            vm.popup.add_user_data.goip_ports = [ vm.goips[0] ]
        }
        axios.get('/sim/').then(response => {
            let nameLengths = response.data.map(function(sim) {
                return sim.slot;
            });
            vm.sim_list = nameLengths
        })               
        if (vm.popup.add_user_data.sim_list.length == 0) {
            vm.popup.add_user_data.sim_list = [ vm.sim_list[0] ]
        }
    },
    deleteUser (pk) {
        const vm = this
        axios.post('/user/delete/', {'pk': pk}).then(response => {
            console.log(response.data)
            if(response.data['message'] == 'ok'){
                vm.showNotify('top-right', 'Пользователь удален!', 'negative')                
                vm.getData()
            }
        }).catch(error => {
            if(error.response.status == 403){
                vm.showNotify('top-right', 'Пополните баланс!', 'negative')
                vm.$store.dispatch('authorize', '')
            }
        })
    },
    sumbit (data, url, callback, path) {
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
        vm.deleteObject(data, url, callback, path)
      })
    },
    openEdit( popup, name, pk, sim, goip ) {
        const vm = this
        vm.popup.add_user_data.username = name
        vm.popup.add_user_data.pk = pk
        vm.popup.add_user_data.sim_list = sim
        vm.popup.add_user_data.goip_ports = goip
        vm.popup.edit_user = true
        axios.get('/goip/').then(response => {
            let nameLengths = response.data.message.map(function(goip) {
                return goip.line_id;
            });
            vm.goips = nameLengths                        
        })        
        if (vm.popup.add_user_data.goip_ports.length == 0) {
            vm.popup.add_user_data.goip_ports = [ vm.goips[0] ]
        }
        axios.get('/sim/').then(response => {
            let nameLengths = response.data.map(function(sim) {
                return sim.slot;
            });
            vm.sim_list = nameLengths
        })               
        if (vm.popup.add_user_data.sim_list.length == 0) {
            vm.popup.add_user_data.sim_list = [ vm.sim_list[0] ]
        }
    },
    editObject (data, url, url_callback=false, path=false) {
        const vm = this        
        let new_data = {}        
        for (let key in data) {
            if (typeof data[key] === "object" && data[key] != null) {
                new_data[key] = data[key].value
            } else {
                new_data[key] = data[key]
            }
        }
        axios.post(url, new_data).then(response => {
          vm.popup.edit_sheduler = false
          vm.popup.edit_simbank = false
          vm.popup.edit_goip = false
          if (response.status == 200) {
            vm.popup.add_sheduler = vm.popup.edit_sheduler = false
            if ( url_callback && path ) {
                vm.getData(url_callback, path)
            }
            vm.showNotify('top-right', 'Настройки изменены!', 'positive')
          }
        })
    },
    deleteObject (url, url_callback=false, path=false) {
        const vm = this
        axios.delete(url).then(response => {
          if (response.status === 204) {
            if ( url_callback && path ) {
                vm.getData(url_callback, path)
            }
            vm.showNotify('top-right', 'Настройки удалены!', 'negative')
          }
        })
    },    
    showNotify (position, message, color) {
      this.$q.notify({
        color: color, 
        textColor: 'white', 
        message: message, 
        position: position,
        timeout: 3000
      })
    }
  },
  beforeMount () {
    this.getData()
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
</style>
