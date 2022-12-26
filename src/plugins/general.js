import axios from "axios";
import schemes from "./schemes"

// String.prototype.format = function () {
//   // store arguments in an array
//   let args = arguments;
//   // use replace to iterate over the string
//   // select the match and check if the related argument is present
//   // if yes, replace the match with the argument
//   return this.replace(/{([0-9]+)}/g, function (match, index) {
//     // check if the argument is present
//     return typeof args[index] == 'undefined' ? match : args[index];
//   });
// };


const mixins = {
    data () {
        return {
            model: {
                smb: {
                    url: '/smb/',
                    data: [],
                    name: 'Симбанк'
                },
                gateway: {
                    url: '/gateway/',
                    data: [],
                    name: 'GoIP шлюз'
                },
                smb_server: {
                    url: '/scheduler/',
                    data: [],
                    name: 'СМС сервер'
                },
                sim: {
                    url: '/sim/',
                    data: [],
                    name: 'Сим-карта'
                },
                operator: {
                    url: '/operator/',
                    data: [],
                    name: 'Оператор'
                },
                channels: {
                    url: '/gateway/state/',
                    data: [],
                    name: 'GoIP линии'
                },
                sms: {
                    url: '/scheduler/get_all_sms/',
                    data: [],
                    name: 'Список СМС'
                },
                gateway_lines: {
                    url: '/gateway/state/',
                    data: [],
                    name: 'GOIP Channels'
                },
                employee: {
                    url: '/employee/',
                    data: [],
                    name: 'Сотрудники'
                }
            },
            settings: {
                smb: [],
                gateway: [],
                smb_server: [],
                operator: [],
                gateway_lines: [],
                goip_type: [
                    {'label': '1', 'value': 1},
                    {'label': '4', 'value': 2},
                    {'label': '8', 'value': 3},
                    {'label': '16', 'value': 4},
                    {'label': '32', 'value': 5}
                ],
                smb_type: [
                    {'label': '32', 'value': 2},
                    {'label': '128', 'value': 1}
                ],
                imeimode: [
                    {'label': 'GOIP Default', 'value': 1},
                    {'label': 'Random', 'value': 2},
                    {'label': 'Set with Slot', 'value': 3},
                    {'label': 'Random with IMSI', 'value': 4},
                    {'label': 'Set from database with IMSI', 'value': 5}
                ],
                sim_status: [
                  {'label': 'Работает', 'value': 1},
                  {'label': 'Не работает', 'value': 2}
                ],
                pay_operation: [
                  {'label': 'Да', 'value': 1},
                  {'label': 'Нет', 'value': 0}
                ]
            },
            popup: {
                active: false,
                gateway: {
                    submitting: false,
                    active: false,
                    update: false,
                    scheme: JSON.parse(JSON.stringify(schemes.gateway))
                },
                smb: {
                    submitting: false,
                    active: false,
                    update: false,
                    scheme: JSON.parse(JSON.stringify(schemes.smb))
                },
                smb_server: {
                    submitting: false,
                    active: false,
                    update: false,
                    scheme: JSON.parse(JSON.stringify(schemes.smb_server))
                },
                sim: {
                    submitting: false,
                    active: false,
                    update: false,
                    scheme: JSON.parse(JSON.stringify(schemes.sim))
                },
                activate_sim: {
                    submitting: false,
                    active: false,
                    update: false,
                    scheme: JSON.parse(JSON.stringify(schemes.activate_sim))
                },
                send_ussd: {
                    submitting: false,
                    active: false,
                    update: false,
                    scheme: JSON.parse(JSON.stringify(schemes.send_ussd))
                },
                send_sms: {
                    submitting: false,
                    active: false,
                    update: false,
                    scheme: JSON.parse(JSON.stringify(schemes.send_sms))
                },
                employee: {
                    submitting: false,
                    active: false,
                    update: false,
                    scheme: JSON.parse(JSON.stringify(schemes.employee))
                },
                share_lines: {
                    submitting: false,
                    active: false,
                    update: false,
                    scheme: JSON.parse(JSON.stringify(schemes.share_lines))
                },
                share_slots: {
                    submitting: false,
                    active: false,
                    update: false,
                    scheme: JSON.parse(JSON.stringify(schemes.share_slots))
                },
                change_password: {
                    submitting: false,
                    active: false,
                    update: false,
                    scheme: JSON.parse(JSON.stringify(schemes.change_password))
                },
            }
        }
    },
    methods: {
        createObject: function (data, type, update= false) {
            const vm = this
            vm.popup[type].submitting = true
            const method = update ? 'patch' : 'post'
            const url = update ? `${vm.model[type].url}${update}/` : vm.model[type].url
            let new_data = {}
            for (let key in data) {
              if ( data[key].type === 'select' ) {
                new_data[key] = data[key].value.value
              } else {
                new_data[key] = data[key].value
              }
            }
            axios[method](url, new_data).then(response => {
                vm.popup[type].submitting = false
                if ([200, 201].indexOf(response.code) > -1 ) {
                    vm.getData(type)
                    vm.showNotify('top-right', update ? 'Данные обновлены' : 'Настройки добавлены!', 'positive')
                    vm.popup.active = vm.popup[type].active = false
                    vm.popup[type].update = false
                    vm.popup[type].scheme = JSON.parse(JSON.stringify(schemes[type]))
                } else if ( response.code === 400) {
                    let message = ''
                    for ( let item in response.data) {
                        if (vm.popup[type].scheme[item]){
                            message += `${vm.popup[type].scheme[item].label}: ${response.data[item]} <br>`
                        } else {
                            message += `${response.data[item]} <br>`
                        }
                    }
                    vm.showNotify('top-right', message, 'negative')
                }
            })
        },
        deleteObject(id, type) {
          const vm = this
          axios.delete(`${vm.model[type].url}${id}/`).then(response => {
            if (response.code === 204) {
                vm.getData(type)
                vm.showNotify('top-right', `Данные удалены: ${vm.model[type].name}`, 'positive')
            }
          })
        },
        showNotify(position, message, color) {
            this.$q.notify({
                color: color,
                textColor: 'white',
                message: message,
                html: true,
                position: position,
                timeout: 3000
            })
        },
        actionRequest(url, data, type, callback = '') {
            const vm = this
            if (type) {
                vm.popup[type].submitting = true
            }
            let new_data = {}
            for (let key in data) {
              if ( data[key].type === 'select' ) {
                  new_data[key] = data[key].value.value
              } else if ( data[key].type === 'custom' ) {
                  if ( key === 'custom' ){
                      continue
                  }
                  new_data = data[key]
              } else {
                  new_data[key] = data[key].value
              }
              console.log(key)
            }
            console.log(url, new_data)
            axios.post(url, new_data).then(response => {
                if (type) {
                    vm.popup[type].submitting = false
                    vm.popup.active = vm.popup[type].active = false
                    vm.popup[type].scheme = JSON.parse(JSON.stringify(schemes[type]))
                }
                vm.showNotify(
                    'top-right',
                    response.message,
                    response.code === 200 ? 'positive' : 'negative'
                )
                if (callback) {
                    vm.getData(callback)
                }
            })
            return true
        },
        getData(type, params, id) {
            const vm = this
            let url
            if (id) {
                url = vm.model[type].url
            } else {
                url = params ? `${vm.model[type].url}?${params}` : vm.model[type].url
            }
            axios.get(url).then(response => {
                vm.model[type].data = response.data
            })
        },
        openPopup(type, detail = false) {
            const vm = this
            if (detail) {
                vm.popup[type].update = detail
                for (let key in vm.popup[type].scheme) {
                    let obj = vm.model[type].data.filter(item => item.id == detail)[0]
                    if (vm.popup[type].scheme[key].type === 'select') {
                        if (obj[key]) {
                            vm.popup[type].scheme[key].value = vm.settings[key].filter(item => item.value == obj[key])[0]
                        }
                    } else {
                        vm.popup[type].scheme[key].value = obj[key]
                    }
                }
            }
            vm.popup.active = vm.popup[type].active = true
        },
        closePopup(type) {
            const vm = this
            vm.popup[type].scheme = JSON.parse(JSON.stringify(schemes[type]))
            vm.popup.active = vm.popup[type].active = vm.popup[type].update = false
        },
        deleteItem(id, type) {
          const vm = this
          vm.$q.dialog({
            title: 'Подтвердите действие',
            message: `Вы точно хотите удалить ${vm.model[type].name}?`,
            ok: {
              push: true
            },
            cancel: {
              push: true,
              color: 'negative'
            },
            persistent: true
          }).onOk(() => {
            vm.deleteObject(id, type)
          })
        }
    },
    watch: {
        'model.smb.data'(event) {
          this.settings.smb = event.map(function(i){ return {'label': i.name, 'value': i.id}})
        },
        'model.smb_server.data'(event) {
          this.settings.smb_server = event.map(function(i){ return {'label': i.name, 'value': i.id}})
        },
        'model.operator.data'(event) {
          this.settings.operator = event.map(function(i){ return {'label': i.name, 'value': i.id}})
        },
        'model.gateway.data'(event) {
          this.settings.gateway = event.map(function(i){ return {'label': i.name, 'value': i.id}})
        },
        'model.gateway_lines.data'(event) {
          this.settings.gateway_lines = event.map(function(i){ return {'label': `${i.line_id} - ${i.sim_id ? i.sim_id : 'Свободно'}`, 'value': i.line_id}})
        }
    }
}

export default mixins