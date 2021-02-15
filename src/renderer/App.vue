<template lang="pug">
.layout
  control-panel(v-model="options")
  navigation-tabs(
    v-model="state.files"
    v-model:active="state.active"
    @add="addTab"
    @close="closeTab"
  )
  content(
    v-show="file.path === state.active"
    v-for="file in state.files"
    :file="file"
    :active="file.path === state.active"
    :key="file.path"
    @edit="onEdit"
  )
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { vueI18n } from '@/common/plugins/i18n'
import useTabs from '@/renderer/composables/useTabs'
import useFiles from '@/renderer/composables/useFiles'
import Content from '@/renderer/page/Content.vue'
import ControlPanel from '@/renderer/components/ControlPanel/ControlPanel.vue'
import NavigationTabs from '@/renderer/components/Tabs/NavigationTabs.vue'

export default defineComponent({
  name: 'App',
  components: {
    ControlPanel,
    Content,
    NavigationTabs,
  },
  setup () {
    const tabs = useTabs()
    const files = useFiles(tabs)

    return {
      t: vueI18n.t,
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
