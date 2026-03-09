import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { getCurrentInstance, nextTick, onMounted, toValue, ref, watch } from 'vue'

import UniCanvas from './uni-canvas'

import type { ECBasicOption } from 'echarts/types/dist/shared'
import type { MaybeRef, ComputedRef } from 'vue'

export interface UseEChartsOptions {
  canvasId?: string
  option: MaybeRef<ECBasicOption> | ComputedRef<ECBasicOption>
  vm?: any
  width?: number
  height?: number
  devicePixelRatio?: number
  onInit?: (echarts: typeof import('echarts/core')) => void
}

/**
 * @example
 * ```vue
 * <template>
 *   <canvas :id="canvasId" :canvas-id="canvasId" />
 * </template>
 *
 * <script setup lang="ts">
 * import { useECharts } from 'uni-charts'
 * const { canvasId, chart } = useECharts({
 *   option: { ...  },
 * })
 * </script>
 * ```
 */
export function useECharts(option: UseEChartsOptions) {
  const opt = {
    devicePixelRatio: window ? 1 : (uni.getSystemInfoSync().devicePixelRatio || 1),
    ...option,
  }
  onMounted(() => {
    echarts.use([CanvasRenderer])
  })
  const canvasId = opt.canvasId || `echart-canvas-${Math.random().toString(16).slice(2)}`
  const chart = ref<echarts.EChartsType>()
  nextTick(async () => {
    if (opt.onInit) {
      opt.onInit(echarts)
    }
    const canvas = new UniCanvas(
      uni.createCanvasContext(
        canvasId,
        opt.vm || getCurrentInstance()?.proxy || null,
      ),
      canvasId,
    )
    echarts.setPlatformAPI({
      createCanvas: () => canvas as unknown as HTMLCanvasElement,
    })
    function updateChart() {
      canvas.setChart(chart.value)

      if (opt.option) {
        nextTick(() => chart.value?.setOption(toValue(opt.option)))
      }
    }
    if (opt.width || opt.height) {
      if (!opt.width || !opt.height) {
        console.warn('[useECharts] width and height should be set together')
      }
      chart.value = echarts.init(canvas as unknown as HTMLCanvasElement, null, {
        height: opt.height,
        width: opt.width,
        devicePixelRatio: opt.devicePixelRatio,
      })
      updateChart()
    }
    else {
      uni.createSelectorQuery()
        .in(opt.vm || getCurrentInstance()?.proxy || null)
        .select(`#${canvasId}`)
        .boundingClientRect((res) => {
          const { width, height } = (Array.isArray(res) ? res[0] : res) || { width: 0, height: 0 }
          chart.value = echarts.init(canvas as unknown as HTMLCanvasElement, null, {
            height,
            width,
            devicePixelRatio: opt.devicePixelRatio,
          })
          updateChart()
        }).exec()
    }
  })

  watch(
    () => opt.option,
    () => {
      nextTick(() => chart.value?.setOption(toValue(opt.option)))
    },
    { deep: true },
  )

  return {
    canvasId,
    chart,
  }
}
