<template lang="pug">
vue-draggable.tabs(v-model="value" item-key="key")
  template(#item="{ element }")
    navigation-tab(
      :label="element.label"
      :active="activeTab === element.key"
      :is-dirty="element.dirty"
      @click="activeTab = element.key"
    )
</template>

<script lang="ts">
import {
  PropType,
  computed,
  defineComponent,
} from 'vue'
import VueDraggable from 'vuedraggable'
import NavigationTab from '@/renderer/components/Tabs/NavigationTab.vue'

type Tab = {
  label?: string;
  key: string;
  dirty: boolean;
}

export default defineComponent({
  name: 'NavigationTabs',
  components: { NavigationTab, VueDraggable },
  props: {
    modelValue: { type: Array as PropType<Tab[]>, required: true },
    tab: { type: String as PropType<string>, required: true },
  },
  setup (props, { emit }) {
    const methods = {
      value: computed<Tab[]>({
        get: () => props.modelValue,
        set: (value: Tab[]) => emit('update:modelValue', value),
      }),
      activeTab: computed<string>({
        get: () => props.tab,
        set: (value: string) => emit('update:tab', value),
      }),
    }

    return {
      ...methods,
    }
  },
})
</script>

<style lang="sass" scoped>
.tabs
  border-bottom: rgba(255, 255, 255, 0.33) solid 2px
  display: flex
  padding: 8px 4px 0
</style>
