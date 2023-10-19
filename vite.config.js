import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {quasar, transformAssetUrls} from '@quasar/vite-plugin'


export default defineConfig({
  plugins: [
    vue({
      template: {
        // Aquí puedes configurar cómo deseas manejar las URLs de los activos en tus plantillas
        // Por ejemplo:
        transformAssetUrls: {
          img: 'src',
          image: 'xlink:href',
          // Otras configuraciones si es necesario
        }
     }}),   
      quasar({
        sassVariables: 'src/quasar-variables.sass'
      })
  ]
})