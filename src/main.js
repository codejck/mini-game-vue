import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import directive from '@/directive'
import antDesignVue from 'ant-design-vue'

const app = createApp(App)

app.use(router)
app.use(directive)
app.use(antDesignVue)

app.mount('#app')
