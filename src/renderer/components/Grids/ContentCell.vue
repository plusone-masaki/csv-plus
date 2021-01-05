<template lang="pug">
td.content-cell(
  :tabindex="tabindex"
  ref="td"
  @dblclick="onEdit"
  @keydown.prevent.enter="onEdit"
  @keydown.up.exact="move('up', $event)"
  @keydown.down.exact="move('down', $event)"
  @keydown.left.exact="move('left', $event)"
  @keydown.right.exact="move('right', $event)"
)
  div(:style="{ height: '14px' }")
    textarea.content-cell__textarea(
      v-model="inputValue"
      ref="input"
      tabindex="-1"
      @keydown.stop
      @keydown.enter.exact.stop="onBlur"
      @keydown.ctrl.enter.stop="onBreak"
    )
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

type Props = {
  value: string|number;
  tabindex: number;
}

export default defineComponent({
  name: 'ContentCell',
  props: {
    value: { type: [String, Number], required: true },
    tabindex: { type: Number, required: true },
  },
  emits: ['update:value', 'move'],
  setup (props: Props, { emit }) {
    const refs = {
      input: ref<HTMLInputElement>(),
      td: ref<HTMLTableCellElement>(),
    }

    const compute = {
      inputValue: computed({
        get: () => props.value,
        set: (value: string|number) => {
          emit('update:value', value)
        },
      }),
    }

    const methods = {
      onEdit: () => {
        refs.input.value!.focus()
      },

      onBlur: () => {
        refs.td.value!.focus()
      },

      onInput: () => {
        refs.input.value!.focus()
      },

      onBreak: () => {
        emit('update:value', props.value + '\n')
      },

      move: (to: string, e: KeyboardEvent & { currentTarget: HTMLTableCellElement }) => {
        const tabindex = Number(e.currentTarget.getAttribute('tabindex'))
        emit('move', { to, tabindex })
      },
    }

    return {
      ...refs,
      ...methods,
      ...compute,
    }
  },
})
</script>

<style lang="sass" scoped>
.content-cell
  background: #ccc
  padding: 0

  &__textarea
    background: transparent
    border: none
    height: 100%
    left: 1px
    pointer-events: none
    position: relative
    resize: none
    top: -1px
    width: calc(100% - 6px)
</style>
