<template>
<svg
  class="svg-icon"
  viewBox="0 0 24 24"
  :width="`${size}px`"
  :height="`${size}px`"
  :style="{ '--color': color }"
>
  <path
      class="svg-icon__path"
      :d="icons[icon]"
  />
</svg>
</template>

<script>
import * as icon from '@mdi/js'

export default {
  name: 'MdiIcon',

  props: {
    icon: { type: String, required: true },
    size: { type: [String, Number], default: 96 },
    color: { type: String, default: 'inherit' },
  },

  data () {
    return {
      icons: {
        windows: icon.mdiMicrosoftWindows,
        apple: icon.mdiApple,
        linux: icon.mdiLinux,
        download: icon.mdiDownload,
      },
    }
  },
}
</script>

<style scoped>
.svg-icon__path {
  fill: var(--color)
}
</style>
