<template lang="pug">
div.control-panel
  toolbar
    // Has header
    toolbar-switch(
      v-model="options.hasHeader"
      title="先頭の行をヘッダに設定します"
      icon="table-header"
    )
    //toolbar-separator

    // TODO: Search
    //text-input(
    //  v-model="keywords.search"
    //  icon="search"
    //)
    //toolbar-separator

    // TODO: Delimiter
    //toolbar-radio(
    //  v-model="options.delimiter"
    //  value=","
    //  title="コンマ区切り"
    //  icon="comma"
    //  size="33"
    //)
    //toolbar-radio(
    //  v-model="options.delimiter"
    //  value="\t"
    //  title="タブ区切り"
    //  icon="tab"
    //)
    //toolbar-separator
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { vueI18n } from '@/common/plugins/i18n'
import { Options } from '@/renderer/types'
import vModel from '@/renderer/utils/v-model'
import Toolbar from '@/renderer/components/ControlPanel/Toolbar.vue'
import ToolbarSwitch from '@/renderer/components/ControlPanel/ToolbarSwitch.vue'
import ToolbarRadio from '@/renderer/components/ControlPanel/ToolbarRadio.vue'
import ToolbarSeparator from '@/renderer/components/ControlPanel/ToolbarSeparator.vue'
import TextInput from '@/renderer/components/Form/TextInput.vue'

export default defineComponent({
  name: 'ControlPanel',
  components: {
    TextInput,
    Toolbar,
    ToolbarSwitch,
    ToolbarRadio,
    ToolbarSeparator,
  },
  props: {
    modelValue: { type: Object as PropType<Options> },
  },
  setup (props, context) {
    const keywords = {
      search: '',
      filter: '',
    }

    const options = vModel('modelValue', props, context)

    return {
      t: vueI18n.t,
      keywords,
      options,
    }
  },
})
</script>

<style lang="sass" scoped>
.control-panel
  fill: #cfcfcf
</style>
