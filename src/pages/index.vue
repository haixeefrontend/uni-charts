<script setup lang="ts">
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

import type * as ECCharts from 'echarts/charts'
import type * as ECComponents from 'echarts/components'
import type { ComposeOption } from 'echarts/core'

defineOptions({
  name: 'Index',
})

function onInit(echarts: typeof import('echarts/core')) {
  echarts.use([
    TooltipComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout,
  ])
}

type ECOption = ComposeOption<
  ECCharts.PieSeriesOption |
  ECComponents.TooltipComponentOption |
  ECComponents.LegendComponentOption
>
function getOption(): ECOption {
  return {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '5%',
      right: '5%',
      orient: 'vertical',
      width: '50%',
      itemWidth: 6,
      itemHeight: 12,
      itemGap: 32,
      borderRadius: 1,
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        center: ['20%', '50%'],
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        padAngle: 4,
        startAngle: 100,
        itemStyle: {
          borderRadius: 1,
        },
        label: {
          show: false,
          position: 'right',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: Math.random() * 1000, name: 'item 0', itemStyle: { color: '#52C975' } },
          { value: Math.random() * 1000, name: 'item 1', itemStyle: { color: '#84BFFF' } },
          { value: Math.random() * 1000, name: 'item 2', itemStyle: { color: '#D7D7D7' } },
          { value: Math.random() * 1000, name: 'item 3', itemStyle: { color: '#FE9797' } },
          { value: Math.random() * 1000, name: 'item 4', itemStyle: { color: '#FFA160' } },
        ],
      },
    ],
  }
}

const option = reactive(getOption())
function refresh() {
  Object.assign(option, getOption())
}
</script>

<template>
  <echarts-canvas @init="onInit" :option="option"></echarts-canvas>
  <pre class="text-xs">{{ JSON.stringify(option.series?.[0]?.data, null, 2) }}</pre>
  <button @click="refresh">refresh</button>
</template>

<style lang="scss" scoped></style>
