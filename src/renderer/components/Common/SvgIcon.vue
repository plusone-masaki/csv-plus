<template lang="pug">
svg.svg-icon(
  :width="`${size}px`"
  :height="`${size}px`"
  :style="{ '--color': color }"
  viewBox="0 0 24 24"
)
  path.svg-icon__path(:d="icons[icon]")
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import * as Icon from '@mdi/js'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    icon: { type: String as PropType<string>, required: true },
    size: { type: [String, Number] as PropType<string|number>, default: 24 },
    color: { type: String as PropType<string>, default: 'inherit' },
  },
  setup: () => {
    return {
      icons: computed(() => ({
        add: Icon.mdiPlus,
        close: Icon.mdiClose,
        'table-header': Icon.mdiTableArrowUp,
        search: Icon.mdiMagnify,
        comma: Icon.mdiCommaBoxOutline,
        tab: Icon.mdiKeyboardTab,
      })),
    }
  },
})
</script>

<style lang="sass" scoped>
.svg-icon__path
  fill: var(--color)
</style>
