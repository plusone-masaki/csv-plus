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
import { PropType, defineComponent, WritableComputedRef } from 'vue'
import VueDraggable from 'vuedraggable'
import { Tab } from '@/common/types'
import vModel from '@/renderer/utils/v-model'
import NavigationTab from './NavigationTab.vue'
import NavigationAddTab from './NavigationAddTab.vue'
import registerListeners from './composables/registerListeners'

export default defineComponent({
  name: 'NavigationTabs',
  components: { NavigationAddTab, NavigationTab, VueDraggable },
  props: {
    modelValue: { type: Array as PropType<Tab[]>, required: true },
    active: { type: Number as PropType<number>, required: true },
  },

  setup (props, context) {
    const models = {
      tabs: vModel('modelValue', props, context) as WritableComputedRef<Tab[]>,
      activeId: vModel('active', props, context) as WritableComputedRef<number>,
    }

    const methods = {
      onAdd: () => context.emit('add'),
      onClose: (tab: Tab) => context.emit('close', tab),
    }

    registerListeners(models, methods)

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
