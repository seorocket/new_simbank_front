import Vue from 'vue'

import './styles/quasar.sass'
import '@quasar/extras/material-icons/material-icons.css'
import { Quasar, Notify, Meta, Dialog } from 'quasar'

Vue.use(Quasar, {
  plugins: {
    Notify,
    Meta,
    Dialog
  },
  config: {
  }
})