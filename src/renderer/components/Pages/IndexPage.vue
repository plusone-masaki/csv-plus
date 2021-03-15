<template lang="pug">
div.layout
  control-panel(
    v-model="options"
    @add="addTab"
    @open="open"
    @save="save"
  )

  navigation-tabs(
    v-model="state.files"
    v-model:active="state.active"
    @add="addTab"
    @close="closeTab"
  )

  grid-wrapper(
    v-for="file in state.files"
    :file="file"
    :active="file.path === state.active"
    :key="file.path"
    @load="file.table = $event"
    @edit="onEdit"
  )
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useTabs from './composables/useTabs'
import useFiles from './composables/useFiles'
import ControlPanel from '@/renderer/components/ControlPanel/ControlPanel.vue'
import NavigationTabs from '@/renderer/components/Tabs/NavigationTabs.vue'
import GridWrapper from '@/renderer/components/Grids/GridWrapper.vue'

export default defineComponent({
  name: 'IndexPage',
  components: {
    ControlPanel,
    NavigationTabs,
    GridWrapper,
  },
  setup () {
    const tabs = useTabs()
    const files = useFiles(tabs)

    return {
      ...tabs,
      ...files,
    }
  },
})
</script>
