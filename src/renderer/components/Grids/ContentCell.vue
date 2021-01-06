<template lang="pug">
td.content-cell(
  v-text="value"
  :contenteditable="state.editable"
  :tabindex="tabindex"
  ref="input"
  @input="onInput"
  @dblclick="onEdit"
  @blur="onBlur"
  @keydown.prevent.enter.exact="onEditFromEnter"
  @keydown.ctrl.enter="onBreak"
  @keydown.up.exact="onMove('up', $event)"
  @keydown.down.exact="onMove('down', $event)"
  @keydown.left.exact="onMove('left', $event)"
  @keydown.right.exact="onMove('right', $event)"
)
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, nextTick } from 'vue'

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
    const state = reactive({
      editable: false,
    })

    const refs = {
      input: ref<HTMLTableCellElement>(),
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
        state.editable = !state.editable
      },

      onEditFromEnter: () => {
        state.editable = !state.editable
        const selector = window.getSelection()
        if (state.editable && refs.input.value) {
          refs.input.value.focus()
          const range = document.createRange()
          range.selectNodeContents(refs.input.value)
          range.collapse(false)

          selector!.removeAllRanges()
          selector!.addRange(range)
        } else {
          selector!.removeAllRanges()
        }
      },

      onBlur: () => {
        state.editable = false
      },

      onBreak: (e: KeyboardEvent & { target: HTMLInputElement }) => {
        if (!state.editable) return

        const selector = window.getSelection()
        if (selector) {
          const range = selector.getRangeAt(0)
          const lineFeed = document.createTextNode('\n')
          range.deleteContents()
          range.insertNode(lineFeed)
          const offset = range.startOffset + 1
          emit('update:value', e.target.innerText)
          nextTick(() => {
            // カーソルを元の位置に戻す
            if (refs.input.value?.firstChild) {
              range.setStart(refs.input.value.firstChild, offset)
              range.collapse(true)
              selector.removeAllRanges()
              selector.addRange(range)
            }
          })
        }
      },

      onInput: (e: InputEvent & { target: HTMLInputElement }) => {
        emit('update:value', e.target.innerText)
      },

      onMove: (to: string, e: KeyboardEvent & { currentTarget: HTMLTableCellElement }) => {
        if (state.editable) return
        const tabindex = Number(e.currentTarget.getAttribute('tabindex'))
        emit('move', { to, tabindex })
      },
    }

    return {
      state,
      ...refs,
      ...methods,
      ...compute,
    }
  },
})
</script>

<style lang="sass" scoped>
.content-cell
  background: rgba(255, 255, 255, 0.33)
  min-height: 16px
  overflow-y: visible
  padding: 0 2px
  position: relative
  vertical-align: top
  white-space: pre

  &:focus
    outline: #3232ff 2px solid
    z-index: 2

  &[contenteditable="true"]
    background: rgba(255, 255, 255, 0.67)
</style>
