<template lang="pug">
div.control-panel
  // ファイル操作
  toolbar
    icon-switch.toolbar__icon(
      :title="$t('shortcut.add')"
      icon="file"
      @click="add"
    )
    icon-switch.toolbar__icon(
      :title="$t('shortcut.open')"
      icon="folder-open"
      @click="open"
    )
    icon-switch.toolbar__icon(
      :title="$t('shortcut.save')"
      icon="save"
      @click="save"
    )
    icon-switch.toolbar__icon(
      :title="$t('shortcut.print')"
      icon="printer"
      @click="print"
    )

  // シート操作
  toolbar
    // Has header
    icon-switch.toolbar__icon(
      v-model="options.hasHeader"
      :title="$t('shortcut.set_header')"
      icon="table-header"
    )

    toolbar-separator
    icon-switch.toolbar__icon(
      :title="$t('shortcut.undo')"
      icon="undo"
      @click="shortcut(scMap.UNDO)"
    )
    icon-switch.toolbar__icon(
      :title="$t('shortcut.redo')"
      icon="redo"
      @click="shortcut(scMap.REDO)"
    )
    icon-switch.toolbar__icon(
      v-model="options.search.enable"
      :title="$t('shortcut.search')"
      icon="search"
    )
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  WritableComputedRef,
} from 'vue'
import { Options, Table } from '@/@types/types'
import * as scMap from '@/common/shortcuts'
import vModel from '@/renderer/helpers/v-model'
import Shortcut from '@/renderer/plugins/Shortcut'
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
    const shortcut = Shortcut.execute

    return {
      options,
      shortcut,
      scMap,
      ...events,
    }
  },
})
</script>
