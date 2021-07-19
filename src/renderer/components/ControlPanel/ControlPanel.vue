<template lang="pug">
div.control-panel
  toolbar
    icon-switch.toolbar__icon(
      :title="$t('control_panel.add')"
      icon="file"
      @click="add"
    )
    icon-switch.toolbar__icon(
      :title="$t('control_panel.open')"
      icon="folder-open"
      @click="open"
    )
    icon-switch.toolbar__icon(
      :title="$t('control_panel.save')"
      icon="save"
      @click="save"
    )
    icon-switch.toolbar__icon(
      :title="$t('control_panel.print')"
      icon="printer"
      @click="print"
    )
    toolbar-separator
    icon-switch.toolbar__icon(
      v-model="options.search.enable"
      :title="$t('control_panel.search')"
      icon="search"
    )
  toolbar
    // Has header
    icon-switch.toolbar__icon(
      v-model="options.hasHeader"
      :title="$t('control_panel.set_header')"
      icon="table-header"
    )
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  WritableComputedRef,
} from 'vue'
import { Options, Table } from '@/@types/types'
import vModel from '@/renderer/helpers/v-model'
import IconSwitch from '@/renderer/components/Common/IconSwitch.vue'
import IconRadio from '@/renderer/components/Common/IconRadio.vue'
import Toolbar from '@/renderer/components/ControlPanel/Toolbar.vue'
import ToolbarSeparator from '@/renderer/components/ControlPanel/ToolbarSeparator.vue'
import useEvents from './composables/useEvents'

export default defineComponent({
  name: 'ControlPanel',
  components: {
    Toolbar,
    IconSwitch,
    IconRadio,
    ToolbarSeparator,
  },
  props: {
    modelValue: { type: Object as PropType<Options>, required: true },
    table: { type: Object as PropType<Table>, default: undefined },
  },
  setup (props, context) {
    const options = vModel('modelValue', props, context) as WritableComputedRef<Options>
    const events = useEvents(props, context)

    return {
      options,
      ...events,
    }
  },
})
</script>
