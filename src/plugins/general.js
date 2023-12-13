import axios from "axios";
import schemes from "./schemes"
import {mapState} from "vuex";

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
                call: {
                    url: '/scheduler/get_all_call/',
                    data: [],
                    name: 'Список входящих звонков'
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
                },
                client: {
                    url: '/clients/',
                    data: [],
                    name: 'Клиенты'
                },
                all_client: {
                    url: '/clients/?employer=null&view_clients=all',
                    data: [],
                    name: 'Клиенты'
                },
                transaction: {
                    url: '/transactions/',
                    data: [],
                    name: 'Транзакции'
                },
                ticket: {
                    url: '/ticket/',
                    data: [],
                    name: 'Тикеты'
                },
                ticket_message: {
                    url: '/ticket-message/',
                    data: [],
                    name: 'Сообщения тикетов'
                },
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
                transaction: {
                    submitting: false,
                    active: false,
                    update: false,
                    scheme: JSON.parse(JSON.stringify(schemes.client))
                },
                client: {
                    submitting: false,
                    active: false,
                    update: false,
                    scheme: JSON.parse(JSON.stringify(schemes.client))
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
                create_server: {
                    submitting: false,
                    active: false,
                    update: false,
                    scheme: JSON.parse(JSON.stringify(schemes.change_password))
                },
                ticket: {
                    submitting: false,
                    active: false,
                    update: false,
                    scheme: JSON.parse(JSON.stringify(schemes.ticket)),
                    success_message: 'Заявка создана'
                },
                ticket_message: {
                    submitting: false,
                    active: false,
                    update: false,
                    scheme: JSON.parse(JSON.stringify(schemes.ticket_message))
                },
            }
        }
    },
    computed: {
        ...mapState([
            'user'
        ])
    },
    methods: {
        createObject: function (data, type, update= false, message = '', filter_return = '') {
            const vm = this
            console.log(update)
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
                        vm.getData(type, filter_return)
                    if (message) {
                        vm.showNotify('top-right', message, 'positive')
                    } else {
                        vm.showNotify('top-right', update ? 'Данные обновлены' : 'Настройки добавлены!', 'positive')
                    }
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
        createObjectTransaction: function (data, type, update= false, message = '') {
            const vm = this
            vm.popup[type].submitting = true
            const url = vm.model[type].url
            let new_data = {}
            for (let key in data) {
                if ( data[key].type === 'select' ) {
                    new_data[key] = data[key].value.value
                } else {
                    new_data[key] = data[key].value
                }
            }
            new_data['client'] = update
            new_data['type'] = true
            new_data['desc'] = 4
            new_data['client_edit'] = this.user.id
            console.log(new_data)
            axios['post'](url, new_data).then(response => {
                vm.popup[type].submitting = false
                if ([200, 201].indexOf(response.code) > -1 ) {
                    vm.getData('client', 'employer=null&view_clients=all')
                    if (message) {
                        vm.showNotify('top-right', message, 'positive')
                    }
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
        deleteObject (id, type) {
          const vm = this
          axios.delete(`${vm.model[type].url}${id}/`).then(response => {
            if (response.code === 204) {
                vm.getData(type)
                vm.showNotify('top-right', `Данные удалены: ${vm.model[type].name}`, 'positive')
                if (type === 'smb_server') {
                    vm.getData('gateway')
                    vm.getData('smb')
                }
            }
          })
        },
        cancelledTransactionObject(id, type, params, user) {
            const vm = this;
            const obj = vm.model[type].data.filter(item => item.id == id)[0]
            const updateData = { cancelled: true, client_cancelled: user.id };

            axios.patch(`${vm.model[type].url}${id}/?${params}`, updateData).then(response => {
                if (response.code === 200) {
                    vm.getData('transaction', `client=${vm.$route.params.id}&view_transactions=all`)
                    vm.showNotify('top-right', `Транзакция на сумму ${obj.value}₽ отменена`, 'positive');
                }
            }).catch(error => {
                vm.showNotify('top-right', `Ошибка при отмене транзакции`, 'negative');
                console.error('Ошибка при отмене транзакции:', error);
            });
        },
        showNotify(position, message, color, freeze = false) {
            this.$q.notify({
                color: color,
                textColor: 'white',
                message: message,
                html: true,
                position: position,
                timeout: freeze ? 180000 : 3000,
                actions: freeze ? [{ label: 'закрыть', color: 'white', handler: () => {} }] : []
            })
        },
        actionRequest(url, data, type, callback_data = '', hold_notify = false, callback_function = null) {
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
            }
            axios.post(url, new_data).then(response => {
                if (type) {
                    vm.popup[type].submitting = false
                    vm.popup.active = vm.popup[type].active = false
                    vm.popup[type].scheme = JSON.parse(JSON.stringify(schemes[type]))
                }
                vm.showNotify(
                    'top-right',
                    response.message,
                    response.code === 200 ? 'positive' : 'negative',
                    hold_notify
                )
                if (callback_data) {
                    vm.getData(callback_data)
                }
                if (response.code === 200 && callback_function) {
                    vm[callback_function]()
                }
            })
            return true
        },
        getData(type, params, id) {
            const vm = this
            let url
            if (params && id) {
                url = `${vm.model[type].url}${id}/?${params}`
            } else if (id) {
                url = `${vm.model[type].url}${id}/`
            } else {
                url = params ? `${vm.model[type].url}?${params}` : vm.model[type].url
            }
            if (params && id) {
                axios.get(url).then(response => {
                    vm.model[type].data = response.data
                })
            } else if (id) {
                return axios.get(url).then(response => {
                    return response.data
                })
            } else {
                axios.get(url).then(response => {
                    vm.model[type].data = response.data
                })
            }
        },
        openPopup(type, detail = false) {
            const vm = this
            if (detail) {
                vm.popup[type].update = detail
                for (let key in vm.popup[type].scheme) {
                    console.log(vm.model[type].data)
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
        },
        cancelledTransactionItem(id, type, params, user) {
            const vm = this
            let obj = vm.model[type].data.filter(item => item.id == id)[0]
            vm.$q.dialog({
                title: 'Подтвердите действие',
                message: `Вы точно хотите отменить транзакцию на сумму ${obj.value}₽?`,
                ok: {
                    push: true
                },
                cancel: {
                    push: true,
                    color: 'negative'
                },
                persistent: true
            }).onOk(() => {
                vm.cancelledTransactionObject(id, type, params, user)
            })
        },
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