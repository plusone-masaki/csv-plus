<template lang="pug">
form.search-box(
  :style="style"
  @submit.prevent="onSubmit"
)
  div.search-box__container
    text-input.search-box__input(
      v-model="bindKeyword"
      :placeholder="$t('search-box.search')"
      icon="search"
      ref="searchInput"
    )
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from 'vue'
import TextInput from '@/renderer/components/Form/TextInput.vue'
import useStyles from './composables/useStyles'
import vModel from '@/renderer/utils/v-model'

export default defineComponent({
  name: 'SearchBox',
  components: { TextInput },
  props: {
    keyword: { type: String as PropType<string>, default: '' },
    matchCase: { type: Boolean as PropType<boolean>, default: false },
    regexp: { type: Boolean as PropType<boolean>, default: false },
    fixed: { type: Boolean as PropType<boolean>, default: false },
    absolute: { type: Boolean as PropType<boolean>, default: false },
    top: { type: Boolean as PropType<boolean>, default: false },
    bottom: { type: Boolean as PropType<boolean>, default: false },
    right: { type: Boolean as PropType<boolean>, default: false },
    left: { type: Boolean as PropType<boolean>, default: false },
  },
  setup: (props, context) => {
    const searchInput = ref<typeof TextInput|null>(null)
    const bindKeyword = vModel('keyword', props, context)
    const style = useStyles(props)
    const onSubmit = () => context.emit('search', bindKeyword)
    onMounted(() => searchInput.value?.$el.focus())

    return {
      searchInput,
      bindKeyword,
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

  &__container
    padding: 2px
  &__input
    font-size: 16px

.slide-y-transition-leave-active, .slide-y-transition-enter-active
  transform: translateY(-100%)
  transition: all 0.1s linear

.slide-y-transition-enter-to
  transform: translateY(0px)
</style>
