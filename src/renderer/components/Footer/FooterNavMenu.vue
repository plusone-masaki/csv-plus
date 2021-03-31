<template lang="pug">
ul.footer-nav-menu
  li.footer-nav-menu__item(
    v-for="(item, index) in items"
    :key="index"
    @click="value = item.value"
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
  setup: (props, context) => ({
    value: vModel('modelType', props, context),
  }),
})
</script>

<style lang="sass" scoped>
.footer-nav-menu
  bottom: 100%
  list-style: none
  margin: 0
  padding: 0
  position: absolute
  right: -4px
  text-align: left
  z-index: 201

  &__item
    padding: 1px 8px
</style>
