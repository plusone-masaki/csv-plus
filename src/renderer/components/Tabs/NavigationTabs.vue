<template lang="pug">
div.tabs
  vue-draggable(
    v-model="tabs"
    tag="transition-group"
    group="tabs"
    animation="200"
    item-key="id"
  )
    template(#item="{ element }")
      navigation-tab(
        :label="element.file.label"
        :active="activeId === element.id"
        :is-dirty="element.dirty"
        @click="activeId = element.id"
        @close="onClose(element)"
      )

  navigation-add-tab(@add="onAdd")
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import VueDraggable from 'vuedraggable'
import { Tab } from '@/common/types'
import vModel from '@/renderer/utils/v-model'
import NavigationTab from '@/renderer/components/Tabs/NavigationTab.vue'
import NavigationAddTab from '@/renderer/components/Tabs/NavigationAddTab.vue'

export default defineComponent({
  name: 'NavigationTabs',
  components: { NavigationAddTab, NavigationTab, VueDraggable },
  props: {
    modelValue: { type: Array as PropType<Tab[]>, required: true },
    active: { type: Number as PropType<number>, required: true },
  },

  setup (props, context) {
    const models = {
      tabs: vModel('modelValue', props, context),
      activeId: vModel('active', props, context),
    }

    const methods = {
      onAdd: () => context.emit('add'),
      onClose: (tab: Tab) => context.emit('close', tab),
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
</style>
