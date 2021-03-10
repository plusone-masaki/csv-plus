<template lang="pug">
footer.footer-nav
  footer-nav-item {{ activeFile.options.encoding }}
</template>

<script lang="ts">
import { defineComponent, PropType, WritableComputedRef } from 'vue'
import { FileData } from '@/renderer/types'
import vModel from '@/renderer/utils/v-model'
import FooterNavItem from '@/renderer/components/Footer/FooterNavItem.vue'

export default defineComponent({
  name: 'FooterNav',
  components: {
    FooterNavItem,
  },
  props: {
    modelValue: { type: Array as PropType<FileData[]>, required: true },
    active: { type: String as PropType<string>, required: true },
  },
  setup (props, context) {
    const files = vModel('modelValue', props, context) as WritableComputedRef<FileData[]>
    const activeFile = files.value.find(file => file.path === props.active)

    return {
      files,
      activeFile,
    }
  },
})
</script>

<style lang="sass" scoped>
.footer-nav
  display: flex
  height: 18px
  justify-content: flex-end
  overflow-x: hidden
  padding: 0 4px
</style>
