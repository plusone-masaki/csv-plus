<template lang="pug">
ul.footer-nav-menu
  li.footer-nav-menu__item(
    v-for="(item, index) in items"
    :class="{ '--active': value === item.value }"
    :key="index"
    @click="onChange(item.value)"
  )
    | {{ item.label }}
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import vModel from '@/renderer/utils/v-model'

type MenuItem = {
  label: string;
  value: string;
}

export default defineComponent({
  name: 'FooterNavMenu',
  props: {
    modelValue: { type: String as PropType<string>, required: true },
    items: { type: Array as PropType<MenuItem[]>, required: true },
  },
  setup: (props, context) => {
    const value = vModel('modelValue', props, context)
    const onChange = (itemValue: string) => {
      if (value.value === itemValue) return

      value.value = itemValue
      context.emit('change', itemValue)
    }

    return {
      value,
      onChange,
    }
  },
})
</script>

<style lang="sass" scoped>
.footer-nav-menu
  bottom: 100%
  list-style: none
  margin: 0
  max-height: 100px
  overflow-y: auto
  padding: 0
  position: absolute
  right: -4px
  text-align: left
  z-index: 201

  &__item
    padding: 1px 8px
</style>
