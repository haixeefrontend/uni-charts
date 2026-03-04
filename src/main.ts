import { createSSRApp } from 'vue'

// import 'virtual:uno.css'
import src from '.'

import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
    .use(src)

  return { app }
}
