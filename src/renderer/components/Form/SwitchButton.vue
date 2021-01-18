<template lang="pug">
label.switch-button-control
  div.switch-button(
    :class="{ enabled: value }"
    :style="{ '--color': color }"
  )
    div.button
    input.hidden(v-model="value" type="checkbox")
  div.switch-button-label
    slot
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'SwitchButton',
  props: {
    modelValue: { type: Boolean as PropType<boolean>, required: true },
    color: { type: String as PropType<string>, default: '#333333' },
  },
  setup (props, { emit }) {
    const value = computed({
      get: () => props.modelValue,
      set: value => emit('update:modelValue', value),
    })

    return {
      value,
    }
  },
})
</script>

<style lang="sass" scoped>
// For switch-button styling
.switch-button-control
  align-items: center
  cursor: pointer
  display: flex
  flex-direction: row

  .switch-button
    $switch-button-height: 1.6em
    $switch-button-color: var(--color)
    $switch-button-color-disabled: #4D4D4D
    $switch-button-border-thickness: 2px
    $switch-transition: all 0.1s ease-in-out
    $switch-is-rounded: true
    $button-side-length: calc(#{$switch-button-height} - (2 * #{$switch-button-border-thickness}))

    border: $switch-button-border-thickness solid $switch-button-color-disabled
    border-radius: if($switch-is-rounded, $switch-button-height, 0)
    box-shadow: inset 0 0 $switch-button-border-thickness 0 rgba(0, 0, 0, 0.33)
    box-sizing: border-box
    height: $switch-button-height
    transition: $switch-transition
    width: calc(#{$switch-button-height} * 2)

    .button
      background-color: $switch-button-color-disabled
      border: $switch-button-border-thickness solid $switch-button-color-disabled
      border-radius: if($switch-is-rounded, $button-side-length, 0)
      box-sizing: border-box
      height: $button-side-length
      transition: $switch-transition
      width: $button-side-length

    .hidden
      display: none

    &.enabled
      background-color: $switch-button-color
      border: $switch-button-border-thickness solid $switch-button-color
      box-shadow: none

      .button
        background: white
        border: $switch-button-border-thickness solid $switch-button-color
        transform: translateX(calc(#{$button-side-length} + (2 *#{$switch-button-border-thickness})))

  .switch-button-label
    margin-left: 10px
</style>
