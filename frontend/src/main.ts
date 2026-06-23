import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
// @ts-ignore: Ignore CSS import type checking
import 'vue-toastification/dist/index.css'
// @ts-ignore: Ignore CSS import type checking for local styles
import './style.css'

const app = createApp(App)

// Plugins
app.use(createPinia())
app.use(router)
app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
})

app.mount('#app')