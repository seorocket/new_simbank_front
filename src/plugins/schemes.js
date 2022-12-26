const schemes = {
    gateway: {
        name: {
            value: 'blank',
            create_only: false,
            type: 'hidden'
        },
        smb_server: {
            value: {'label': '', 'value': ''},
            create_only: false,
            type: 'select',
            options: 'smb_server',
            label: 'Укажите Sheduler'
        },
        goip_id: {
            value: '',
            create_only: false,
            type: 'input',
            label: 'Укажите ID GOIP'
        },
        password: {
            value: '',
            create_only: false,
            type: 'input',
            label: 'Укажите пароль GOIP для сервера'
        },
        goip_type: {
            value: {'label': '', 'value': ''},
            create_only: false,
            type: 'select',
            options: 'goip_type',
            label: 'Укажите тип GOIP'
        },
        client: {
            value: '',
            create_only: false,
            type: 'hidden'
        }
    },
    employee: {
        username: {
            value: '',
            type: 'input',
            label: 'Логин сотрудника'
        },
        password: {
            value: '',
            type: 'input',
            label: 'Пароль сотрудника',
        },
        employer: {
            value: JSON.parse(window.localStorage.getItem('vuex')).user_id,
            type: 'hidden',
            label: ''
        },
    },
    smb: {
        name: {
            value: 'blank',
            type: 'hidden'
        },
        smb_id: {
            value: '',
            type: 'input',
            label: 'Укажите ID симбанка'
        },
        password: {
            value: '',
            type: 'input',
            label: 'Укажите пароль симбанка'
        },
        smb_server: {
            value: {'label': '', 'value': ''},
            type: 'select',
            options: 'smb_server',
            label: 'Укажите Sheduler'
        },
        smb_type: {
            value: {'label': '', 'value': ''},
            type: 'select',
            options: 'smb_type',
            label: 'Укажите тип симбанка'
        },
        imeimode: {
            value: {'label': 'GOIP Default', 'value': 1},
            type: 'select',
            options: 'imeimode',
            label: 'Укажите тип imeimode'
        },
        client: {
            value: '',
            type: 'hidden'
        }
    },
    smb_server: {
        name: {
            value: '',
            type: 'input',
            label: 'Укажите название сервера'
        },
        server: {
            value: '',
            type: 'input',
            label: 'Укажите путь до сервера'
        },
        client: {
            value: '',
            type: 'hidden'
        }
    },
    sim: {
        name: {
            value: '',
            type: 'input',
            label: 'Укажите номер сим-карты'
        },
        smb_slot: {
            value: '',
            type: 'input',
            label: 'Номер слота симбанка, в который вставлена Сим'
        },
        operator: {
            value: {'label': '', 'value': ''},
            type: 'select',
            options: 'operator',
            label: 'Укажите оператора'
        },
        smb: {
            value: {'label': '', 'value': ''},
            type: 'select',
            options: 'smb',
            label: 'Укажите SIMBANK'
        }
    },
    activate_sim: {
        line_id: {
            value: {'label': '', 'value': ''},
            type: 'select',
            options: 'gateway_lines',
            label: 'Укажите свободный порт'
        },
        sim: {
            value: '',
            type: 'hidden'
        }
    },
    send_ussd: {
        msg: {
            value: '',
            type: 'input',
            label: 'Сообщение'
        },
        line_id: {
            value: '',
            type: 'hidden'
        },
        sim: {
            value: '',
            type: 'hidden'
        }
    },
    change_password: {
        password: {
            value: '',
            type: 'input',
            label: 'Новый пароль'
        }
    },
    send_sms: {
        phone: {
            value: '',
            type: 'input',
            label: 'Номер получателя'
        },
        msg: {
            value: '',
            type: 'input',
            label: 'Сообщение'
        },
        line_id: {
            value: '',
            type: 'hidden'
        },
        sim: {
            value: '',
            type: 'hidden'
        }
    },
    share_lines: {},
    share_slots: {}
}

export default schemes