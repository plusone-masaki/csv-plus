<template lang="pug">
span.toolbar__icon(
  :class="{ active: modelValue }"
  :title="title"
  @click="onClick"
)
  svg-icon(
    :icon="icon"
    :color="color"
    :size="size"
  )
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import SvgIcon from '@/renderer/components/Common/SvgIcon.vue'

export default defineComponent({
  name: 'ToolbarSwitch',
  components: {
    SvgIcon,
  },
  props: {
    modelValue: { type: Boolean as PropType<boolean>, default: false },
    icon: { type: String as PropType<string>, required: true },
    color: { type: String as PropType<string>, default: 'inherit' },
    title: { type: String as PropType<string|undefined>, default: undefined },
    size: { type: Number as PropType<number>, default: 24 },
  },
  setup: (props, { emit }) => ({
    onClick: () => emit('update:modelValue', !props.modelValue),
  }),
})
</script>
