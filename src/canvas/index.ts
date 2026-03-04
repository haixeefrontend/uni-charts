import EchartsCanvas from './echarts-canvas.vue'

import type { App } from 'vue'

export { EchartsCanvas }

export function install(app: App) {
  app.component(EchartsCanvas.name!, EchartsCanvas)
}

export default {
  install,
}
