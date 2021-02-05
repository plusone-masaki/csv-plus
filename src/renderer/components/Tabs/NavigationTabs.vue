<template lang="pug">
div.tabs
  vue-draggable(
    v-model="tabs"
    tag="transition-group"
    group="tabs"
    animation="200"
    item-key="path"
  )
    template(#item="{ element }")
      navigation-tab(
        :label="element.label"
        :active="activeTab === element.path"
        :is-dirty="element.dirty"
        @click="activeTab = element.path"
        @close="onClose(element)"
      )

  navigation-add-tab(@add="onAdd")
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import VueDraggable from 'vuedraggable'
import { FileData } from '@/renderer/types'
import vModel from '@/renderer/utils/v-model'
import NavigationTab from '@/renderer/components/Tabs/NavigationTab.vue'
import NavigationAddTab from '@/renderer/components/Tabs/NavigationAddTab.vue'

export default defineComponent({
  name: 'NavigationTabs',
  components: { NavigationAddTab, NavigationTab, VueDraggable },
  props: {
    modelValue: { type: Array as PropType<FileData[]>, required: true },
    active: { type: String as PropType<string>, required: true },
  },

  setup (props, context) {
    const models = {
      tabs: vModel('modelValue', props.modelValue, context),
      activeTab: vModel('active', props.active, context),
    }

    const methods = {
      onAdd: () => context.emit('add'),
      onClose: (tab: FileData) => context.emit('close', tab),
    }

    return {
      ...models,
      ...methods,
    }
  },
})
</script>

<style lang="sass" scoped>
.tabs
  box-sizing: border-box
  display: flex
  overflow-x: scroll
  white-space: nowrap
  width: 100vw

  &::-webkit-scrollbar
    height: 4px
    transition: background-color .3s ease

  &::-webkit-scrollbar-track
    background-color: rgba(255, 255, 255, 0.33)

  &:hover::-webkit-scrollbar-thumb
    background-color: rgba(0, 0, 0, 0.33)
</style>
