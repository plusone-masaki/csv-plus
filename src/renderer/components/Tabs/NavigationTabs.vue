<template lang="pug">
div.tabs
  vue-draggable(v-model="value" item-key="path")
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
import {
  PropType,
  computed,
  defineComponent,
} from 'vue'
import VueDraggable from 'vuedraggable'
import { FileData } from '@/renderer/types'
import NavigationTab from '@/renderer/components/Tabs/NavigationTab.vue'
import NavigationAddTab from '@/renderer/components/Tabs/NavigationAddTab.vue'

export default defineComponent({
  name: 'NavigationTabs',
  components: { NavigationAddTab, NavigationTab, VueDraggable },
  props: {
    modelValue: { type: Array as PropType<FileData[]>, required: true },
    tab: { type: String as PropType<string>, required: true },
  },
  setup (props, { emit }) {
    const compute = {
      value: computed<FileData[]>({
        get: () => props.modelValue,
        set: (value: FileData[]) => emit('update:modelValue', value),
      }),
      activeTab: computed<string>({
        get: () => props.tab,
        set: (value: string) => emit('update:tab', value),
      }),
    }

    const methods = {
      onAdd: () => emit('add'),
      onClose: (tab: FileData) => emit('close', tab),
    }

    return {
      ...compute,
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
