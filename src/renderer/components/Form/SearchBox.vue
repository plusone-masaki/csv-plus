<template lang="pug">
form.search-box(
  :style="style"
  @submit.prevent="onSubmit"
)
  text-input(
    v-model="keyword"
    :placeholder="$t('search-box.search')"
  )
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import TextInput from '@/renderer/components/Form/TextInput.vue'
import useStyles from './composables/useStyles'

export default defineComponent({
  name: 'SearchBox',
  components: { TextInput },
  props: {
    fixed: { type: Boolean as PropType<boolean>, default: false },
    absolute: { type: Boolean as PropType<boolean>, default: false },
    top: { type: Boolean as PropType<boolean>, default: false },
    bottom: { type: Boolean as PropType<boolean>, default: false },
    right: { type: Boolean as PropType<boolean>, default: false },
    left: { type: Boolean as PropType<boolean>, default: false },
  },
  setup: (props, context) => {
    const keyword = ref('')
    const style = useStyles(props)
    const onSubmit = () => context.emit('search', keyword)

    return {
      keyword,
      style,
      onSubmit,
    }
  },
})
</script>

<style lang="sass" scoped>
.search-box
  background: rgba(207, 207, 207, 1)
  box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.08)
  padding: 2px 8px
  pointer-events: visible
</style>
