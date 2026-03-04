<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.debug('App Launch')
})

onShow(() => {
  console.debug('App Show')
})

onHide(() => {
  console.debug('App Hide')
})
</script>

<style lang="scss"></style>
