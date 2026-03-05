<script setup lang="ts">
import { nextTick, ref, onMounted, watch, getCurrentInstance } from 'vue'
import * as echarts from 'echarts/core'
import { LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

import UniCanvas from './uni-canvas'

import type { ECBasicOption } from 'echarts/types/dist/shared'

defineOptions({
  name: 'EchartsCanvas',
})

const props = defineProps({
  option: {
    type: Object as PropType<ECBasicOption>,
    default: () => ({}),
  },
  vm: {
    type: Object,
    default: () => undefined,
  },
})

const emit = defineEmits<{
  (e: 'init', echarts: typeof import('echarts/core')): void
}>()

const canvasId = `ring-chart-canvas-${Math.random().toString(16).slice(2)}`
const canvas = ref<UniCanvas>()
const myChart = ref<echarts.EChartsType>()
echarts.use([CanvasRenderer, LegendComponent])
emit('init', echarts)
onMounted(async () => {
  await nextTick()
  canvas.value = new UniCanvas(
    uni.createCanvasContext(
      canvasId,
      // #ifdef MP-WEIXIN
      props.vm || getCurrentInstance()?.proxy,
      // #endif
    ),
    canvasId,
  )
  echarts.setPlatformAPI?.({
    createCanvas: () => canvas.value as unknown as HTMLCanvasElement,
  })
  uni.createSelectorQuery()
    // #ifdef MP-WEIXIN
    .in(props.vm || getCurrentInstance()?.proxy)
    // #endif
    .select(`#${canvasId}`)
    .boundingClientRect((res) => {
      const { width, height } = Array.isArray(res) ? res[0] : res
      myChart.value = echarts.init(canvas.value as unknown as HTMLCanvasElement, null, {
        height,
        width,
        devicePixelRatio: 1,
      })
      canvas.value?.setChart(myChart.value)

      if (props.option) {
        myChart.value?.setOption(props.option)
      }
    }).exec()
})
watch(
  () => props.option,
  () => {
    if (myChart.value) {
      myChart.value.setOption(props.option)
    }
  },
  { deep: true },
)
</script>

<template>
  <canvas
    :id="canvasId"
    :canvas-id="canvasId"
    style="width: 100%; height: 100%;"
    @touchcancel="canvas?.event['touchCancel']"
    @touchend="canvas?.event['touchEnd']"
    @touchmove="canvas?.event['touchMove']"
    @touchstart="canvas?.event['touchStart']"
  />
</template>

<style lang="scss" scoped></style>
