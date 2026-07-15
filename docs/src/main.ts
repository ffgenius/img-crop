import { createApp } from 'vue'

import './style.css'
import 'highlight.js/styles/atom-one-dark.css'
import 'antdv-next/dist/reset.css'
import 'antdv-next/dist/antd.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
