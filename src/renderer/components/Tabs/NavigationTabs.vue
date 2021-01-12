<template lang="pug">
vue-draggable.tags(v-model="value" item-key="key")
  template(#item="{ element }")
    navigation-tab(
      :label="element.label"
      :active="_tab === element.key"
      :is-dirty="element.dirty"
      @click="_tab = element.key"
    )
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
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
    modelValue: { type: Array, required: true },
    tab: { type: String, required: true },
  },
  setup (props, { emit }) {
    const methods = {
      value: computed<Tab[]>({
        get: () => props.modelValue as Tab[],
        set: (value: Tab[]) => emit('change', value),
      }),
      _tab: computed<string>({
        get: () => props.tab as string,
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
::v-deep
  .tabs
    display: flex
</style>
