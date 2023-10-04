import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import { router } from './Routes/Routes.js'

const app = createApp(App)


app.use(router)

app.use(Quasar, {
    plugins: {}
})

app.mount('#app')