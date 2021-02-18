<template lang="pug">
.layout
  control-panel(
    v-model="options"
    @new="addTab"
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
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useTabs from '@/renderer/composables/useTabs'
import useFiles from '@/renderer/composables/useFiles'
import ControlPanel from '@/renderer/components/ControlPanel/ControlPanel.vue'
import NavigationTabs from '@/renderer/components/Tabs/NavigationTabs.vue'
import GridWrapper from '@/renderer/components/Grids/GridWrapper.vue'

export default defineComponent({
  name: 'App',
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

<style lang="sass">
@font-face
  font-family: SourceHansCodeJP
  src: url("../assets/fonts/SourceHanCodeJP-Regular.otf")

#app
  //font-family: SourceHansCodeJP, Avenir, Helvetica, Arial, sans-serif
  font-family: SourceHansCodeJP, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
</style>
