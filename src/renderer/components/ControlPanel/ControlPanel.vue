<template lang="pug">
div.control-panel
  toolbar
    toolbar-switch(
      :title="$t('control_panel.add')"
      icon="file"
      @click="add"
    )
    toolbar-switch(
      :title="$t('control_panel.open')"
      icon="folder-open"
      @click="open"
    )
    toolbar-switch(
      :title="$t('control_panel.save')"
      icon="save"
      @click="save"
    )
    toolbar-switch(
      :title="$t('control_panel.print')"
      icon="printer"
      @click="print"
    )
    toolbar-separator
    toolbar-switch(
      v-model="options.search"
      :title="$t('control_panel.search')"
      icon="search"
    )
  toolbar
    // Has header
    toolbar-switch(
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
import HandsOnTable from 'handsontable'
import { Options } from '@/common/types'
import vModel from '@/renderer/utils/v-model'
import Toolbar from '@/renderer/components/ControlPanel/Toolbar.vue'
import ToolbarSwitch from '@/renderer/components/ControlPanel/ToolbarSwitch.vue'
import ToolbarRadio from '@/renderer/components/ControlPanel/ToolbarRadio.vue'
import ToolbarSeparator from '@/renderer/components/ControlPanel/ToolbarSeparator.vue'
import useEvents from './composables/useEvents'
import registerListeners from './composables/registerListeners'

export default defineComponent({
  name: 'ControlPanel',
  components: {
    Toolbar,
    ToolbarSwitch,
    ToolbarRadio,
    ToolbarSeparator,
  },
  props: {
    modelValue: { type: Object as PropType<Options>, required: true },
    table: { type: Object as PropType<HandsOnTable|null>, default: null },
  },
  setup (props, context) {
    const options = vModel('modelValue', props, context) as WritableComputedRef<Options>
    const events = useEvents(props, context, options)

    registerListeners(options, context, events)

    return {
      options,
      ...events,
    }
  },
})
</script>
