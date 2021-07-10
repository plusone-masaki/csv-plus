<template lang="pug">
div.search-box(:style="style")
  // 検索ボックス
  div.search-box__container
    text-input.search-box__input(
      v-model="model.keyword"
      :placeholder="$t('search-box.search')"
      id="search-input"
      ref="searchInput"
      width="150"
      @keypress.enter.stop="onSubmit"
    )
      template(v-slot:append)
        icon-switch(
          v-model="model.matchCase"
          :title="$t('search-box.match_case')"
          icon="letter-case"
          size="18"
        )
        icon-switch(
          v-model="model.regexp"
          :title="$t('search-box.regexp')"
          icon="regex"
          size="18"
        )

    div.search-box__information
      span.search-box__results(v-if="model.results")
        | {{ $t('search-box.results', { current: model.results.current + 1, length: model.results.length }) }}
      span.search-box__results(v-else)
        | {{ $t('search-box.no_results') }}

    icon-switch.close-btn(
      :title="$t('search-box.close')"
      icon="close"
      size="12"
      @click="model.enable = false"
    )
    icon-switch.replacer-btn(
      v-model="model.enableReplace"
      :title="$t('search-box.replace')"
      :icon="model.enableReplace ? 'up' : 'down'"
      size="12"
    )

  // 置換ボックス
  div.search-box__container(v-show="model.enableReplace")
    text-input.search-box__input(
      v-model="model.replace"
      :placeholder="$t('search-box.replace')"
      width="194"
    )

    div.replace__buttons
      chip-label.replace__buttons--button(
        :title="$t('search-box.replace')"
        :color="model.results ? '#666666' : '#999999'"
        @click="model.results && onReplace(false)"
      )
        svg-icon.replace__buttons--icon(
          color="#FFFFFF"
          icon="replace"
          size="12"
        )
      chip-label.replace__buttons--button(
        :title="$t('search-box.replace_all')"
        :color="model.results ? '#666666' : '#999999'"
        @click="model.results && onReplace(true)"
      )
        svg-icon.replace__buttons--icon(
          color="#FFFFFF"
          icon="replace-all"
          size="12"
        )
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  PropType,
  ref, watch,
  WritableComputedRef,
} from 'vue'
import { SearchOption } from '@/common/types'
import useStyles from './composables/useStyles'
import vModel from '@/renderer/utils/v-model'
import ChipLabel from '@/renderer/components/Common/ChipLabel.vue'
import SvgIcon from '@/renderer/components/Common/SvgIcon.vue'
import IconSwitch from '@/renderer/components/Common/IconSwitch.vue'
import TextInput from '@/renderer/components/Form/TextInput.vue'

export default defineComponent({
  name: 'SearchBox',
  components: {
    SvgIcon,
    ChipLabel,
    IconSwitch,
    TextInput,
  },
  props: {
    modelValue: { type: Object as PropType<SearchOption>, required: true },
    fixed: { type: Boolean as PropType<boolean>, default: false },
    absolute: { type: Boolean as PropType<boolean>, default: false },
    top: { type: Boolean as PropType<boolean>, default: false },
    bottom: { type: Boolean as PropType<boolean>, default: false },
    right: { type: Boolean as PropType<boolean>, default: false },
    left: { type: Boolean as PropType<boolean>, default: false },
  },
  setup: (props, context) => {
    const searchInput = ref<typeof TextInput>()
    const model = vModel('modelValue', props, context) as WritableComputedRef<SearchOption>
    const style = useStyles(props)
    const onSubmit = (e: KeyboardEvent) => context.emit('search', e)
    const onReplace = (all = false) => context.emit('replace', all)
    onMounted(() => searchInput.value?.$el.focus())
    watch(() => model.value.matchCase, () => context.emit('search'))
    watch(() => model.value.regexp, () => context.emit('search'))

    return {
      searchInput,
      model,
      style,
      onSubmit,
      onReplace,
    }
  },
})
</script>

<style lang="sass" scoped>
.search-box
  background: rgba(207, 207, 207, 1)
  box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.08)
  padding: 2px 0 2px 8px
  pointer-events: visible

  &__container
    align-items: center
    display: flex
    padding: 2px

  &__input
    font-size: 16px

  &__information
    min-width: 100px
    text-align: left

  &__results
    font-size: 14px
    padding-left: 8px

.close-btn
  position: absolute
  right: 2px
  top: 2px

.replacer-btn
  position: absolute
  right: 2px
  top: 18px

.replace__buttons
  align-self: flex-end
  padding: 0 4px

  &--button
    margin-right: 3px

  &--icon
    padding: 0 3px

.slide-y-transition-leave-active, .slide-y-transition-enter-active
  transform: translateY(-100%)
  transition: all 0.1s linear

.slide-y-transition-enter-to
  transform: translateY(0px)
</style>
