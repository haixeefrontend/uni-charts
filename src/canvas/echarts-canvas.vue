<script setup lang="ts">
import * as echarts from 'echarts/core'

import UniCanvas from './uni-canvas'

import type { EChartsOption } from 'echarts'

defineOptions({
  name: 'EchartsCanvas',
})

const props = defineProps({
  option: {
    type: Object as PropType<EChartsOption>,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  (e: 'init', echarts: typeof import('echarts/core')): void
}>()

const canvasId = `ring-chart-canvas-${Math.random().toString(16).slice(2)}`
const myChart = ref<echarts.EChartsType>()
onMounted(() => {
  emit('init', echarts)
  const canvas = new UniCanvas(
    uni.createCanvasContext(canvasId, getCurrentInstance()?.proxy),
    canvasId,
  )
  echarts.setPlatformAPI?.({
    createCanvas: () => canvas as unknown as HTMLCanvasElement,
  })
  uni.createSelectorQuery()
    .in(getCurrentInstance()?.proxy)
    .select(`#${canvasId}`)
    .boundingClientRect((res) => {
      const { width, height } = Array.isArray(res) ? res[0] : res
      myChart.value = echarts.init(canvas as unknown as HTMLCanvasElement, null, {
        height: height,
        width: width,
        devicePixelRatio: 1,
      })
      canvas.setChart(myChart.value)

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
  <view
    :style="{ width: '100%', height: '300rpx' }"
  >
    <canvas
      :id="canvasId"
      :canvas-id="canvasId"
      style="width: 100%; height: 100%;"
    />
  </view>
</template>

<style lang="scss" scoped></style>
