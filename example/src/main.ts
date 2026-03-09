import { createSSRApp } from 'vue'

// import 'virtual:uno.css'
import App from './App.vue'
import EchartsCanvas from '@haixee/uni-charts'

export function createApp() {
  const app = createSSRApp(App)
    .use(EchartsCanvas)

  return { app }
}
