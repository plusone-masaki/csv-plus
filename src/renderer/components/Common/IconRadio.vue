<template lang="pug">
label.icon-radio(
  :class="{ active: modelValue === value }"
  :title="title"
)
  input.hidden(
    v-model="checked"
    :value="value"
    type="radio"
  )
  svg-icon(
    :icon="icon"
    :color="color"
    :size="size"
  )
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import vModel from '@/renderer/utils/v-model'
import SvgIcon from '@/renderer/components/Common/SvgIcon.vue'

export default defineComponent({
  name: 'IconRadio',
  components: {
    SvgIcon,
  },
  props: {
    modelValue: { type: [Boolean, String] as PropType<boolean|string>, default: false },
    value: { type: String as PropType<string>, required: true },
    icon: { type: String as PropType<string>, required: true },
    color: { type: String as PropType<string>, default: 'inherit' },
    title: { type: String as PropType<string|undefined>, default: undefined },
    size: { type: [String, Number] as PropType<string|number>, default: 36 },
  },
  setup: (props, context) => ({
    checked: vModel('modelValue', props, context),
  }),
})
</script>
