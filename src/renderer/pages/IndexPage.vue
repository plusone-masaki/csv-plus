<template lang="pug">
div.layout
  control-panel(
    v-model="options"
    v-bind="activeTab"
    @add="addTab"
    @open="open"
    @save="save"
    @print="print"
  )

  navigation-tabs(
    v-model="state.tabs"
    v-model:active="state.activeId"
    @add="addTab"
    @close="closeTab"
  )

  grid-wrapper(
    v-if="activeTab"
    :tab="activeTab"
    :key="activeTab && activeTab.id"
    @edit="onEdit"
  )
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ControlPanel from '@/renderer/components/ControlPanel/ControlPanel.vue'
import NavigationTabs from '@/renderer/components/Tabs/NavigationTabs.vue'
import GridWrapper from '@/renderer/components/Grids/GridWrapper.vue'
import useTabs from './composables/useTabs'
import useFiles from './composables/useFiles'
import registerListeners from './composables/registerListeners'
import registerShortcuts from './composables/registerShortcuts'

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
    registerListeners(tabs)
    registerShortcuts(tabs)

    return {
      ...tabs,
      ...files,
    }
  },
})
</script>
