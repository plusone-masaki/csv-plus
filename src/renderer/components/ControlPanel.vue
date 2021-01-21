<template lang="pug">
div.control-panel
  div.control-panel__options
    h2.control-panel__title {{ t('setting.title') }}
    switch-button(
      v-model="settings.hasHeader"
      color="#006600"
    )
      | {{ t('options.header') }}
      | {{ settings.hasHeader ? t('options.have') : t('options.not_have') }}

    fieldset
      legend {{ t('options.csv_option') }}
      span {{ t('options.delimiter') }}
      text-input(
        v-model="settings.delimiter"
        width="32px"
      )
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { vueI18n } from '@/common/plugins/i18n'
import { Options } from '@/renderer/types'
import SwitchButton from '@/renderer/components/Form/SwitchButton.vue'
import TextInput from '@/renderer/components/Form/TextInput.vue'
import ChipItem from '@/renderer/components/Form/ChipItem.vue'

export default defineComponent({
  name: 'ControlPanel',
  components: { ChipItem, TextInput, SwitchButton },
  props: {
    modelValue: { type: Object as PropType<Options> },
  },
  setup (props, { emit }) {
    const settings = computed({
      get: () => props.modelValue,
      set: value => emit('update:modelValue', value),
    })

    return {
      t: vueI18n.t,
      settings,
    }
  },
})
</script>

<style lang="sass" scoped>
.control-panel
  background: rgba(255, 255, 255, 0.33)
  color: #cfcfcf
  display: grid
  padding: 8px 16px
  text-align: start

  &__title
    font-size: 1.2rem
    letter-spacing: 0.15rem
    margin: 4px 0
</style>
