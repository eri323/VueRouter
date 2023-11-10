import { createApp } from 'vue'
import {createPinia} from 'pinia'
import './style.css'
import App from './App.vue'

import { Quasar , Notify} from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import { router } from './Routes/Routes.js'
import axios from 'axios'
const app = createApp(App)
const pinia = createPinia()

app.use(Quasar, {
    plugins: {
        Notify,
    }
})

app.use(pinia)
app.use(router)

axios.defaults.baseURL="https://transporte-0ydp.onrender.com/api/"
app.mount('#app')


