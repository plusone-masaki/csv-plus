<template lang="pug">
div.control-panel
  toolbar
    toolbar-icon(
      v-model="options.hasHeader"
      icon="table-header"
    )
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { vueI18n } from '@/common/plugins/i18n'
import { Options } from '@/renderer/types'
import Toolbar from '@/renderer/components/ControlPanel/Toolbar.vue'
import ToolbarIcon from '@/renderer/components/ControlPanel/ToolbarIcon.vue'

export default defineComponent({
  name: 'ControlPanel',
  components: {
    Toolbar,
    ToolbarIcon,
  },
  props: {
    modelValue: { type: Object as PropType<Options> },
  },
  setup (props, { emit }) {
    const options = computed({
      get: () => props.modelValue,
      set: value => emit('update:modelValue', value),
    })

    return {
      t: vueI18n.t,
      options,
    }
  },
})
</script>

<style lang="sass" scoped>
.control-panel
  fill: #cfcfcf
</style>
