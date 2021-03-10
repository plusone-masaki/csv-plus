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
    v-show="file.path === state.active"
    v-for="file in state.files"
    :file="file"
    :active="file.path === state.active"
    :key="file.path"
    @load="onLoad"
    @edit="onEdit"
  )

  footer-nav(
    v-model="state.files"
    :active="state.active"
  )
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useTabs from './composables/useTabs'
import useFiles from './composables/useFiles'
import ControlPanel from '@/renderer/components/ControlPanel/ControlPanel.vue'
import NavigationTabs from '@/renderer/components/Tabs/NavigationTabs.vue'
import GridWrapper from '@/renderer/components/Grids/GridWrapper.vue'
import FooterNav from '@/renderer/components/Footer/FooterNav.vue'

export default defineComponent({
  name: 'IndexPage',
  components: {
    ControlPanel,
    NavigationTabs,
    GridWrapper,
    FooterNav,
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

<style lang="sass">
</style>
