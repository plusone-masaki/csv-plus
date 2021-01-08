<template lang="pug">
td.content-cell(
  v-text="modelValue"
  :class="{ selected: state.selected }"
  :contenteditable="state.editable"
  :tabindex="tabindex"
  :data-rows="rows"
  :data-cols="cols"
  ref="input"
  @input="onInput"
  @dblclick="onEdit"
  @blur="onBlur"
  @keydown.prevent.enter.exact="onEdit"
  @keydown.ctrl.enter="onBreak"
  @keydown.up.exact="onMove('up', $event)"
  @keydown.down.exact="onMove('down', $event)"
  @keydown.left.exact="onMove('left', $event)"
  @keydown.right.exact="onMove('right', $event)"
)
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  ref,
  nextTick,
} from 'vue'

type Props = {
  modelValue: string|number;
  tabindex: number;
}

export default defineComponent({
  name: 'ContentCell',
  emits: ['input'],
  props: {
    modelValue: { type: [String, Number], required: true },
    tabindex: { type: Number, required: true },
    rows: { type: Number, required: true },
    cols: { type: Number, required: true },
  },
  setup (props: Props, { emit }) {
    const state = reactive({
      editable: false,
      selected: false,
    })

    const refs = {
      input: ref<HTMLTableCellElement>(),
    }

    const compute = {
      inputValue: computed({
        get: () => props.modelValue,
        set: (value: string|number) => {
          emit('input', value)
        },
      }),
    }

    const onMove = (to: string, e: KeyboardEvent|MouseEvent & { currentTarget: HTMLTableCellElement }) => {
      const target = e.currentTarget as HTMLTableCellElement
      if (state.editable || !target) return

      const tabindex = Number(target.getAttribute('tabindex'))
      const rows = Number(target.getAttribute('data-rows'))
      const cols = Number(target.getAttribute('data-cols'))

      let el: HTMLTableCellElement|null = null
      switch (to) {
        case 'up':
          el = document.querySelector(`.content-cell[data-rows="${rows - 1}"][data-cols="${cols}"]`)
          break
        case 'down':
          el = document.querySelector(`.content-cell[data-rows="${rows + 1}"][data-cols="${cols}"]`)
          break
        case 'left':
          el = document.querySelector(`.content-cell[tabindex="${tabindex - 1}"]`)
          break
        case 'right':
          el = document.querySelector(`.content-cell[tabindex="${tabindex + 1}"]`)
          break
      }

      if (el) el.focus()
    }

    const methods = {
      onMove,

      onEdit: (e: KeyboardEvent|MouseEvent & { currentTarget: HTMLTableCellElement }) => {
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
          onMove('down', e)
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
          emit('input', e.target.innerText)
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
        emit('input', e.target.innerText)
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
  box-sizing: border-box
  min-height: 16px
  overflow-y: visible
  padding: 2px
  position: relative
  vertical-align: top
  user-select: none
  white-space: pre

  &.selected
    border: #3232ff 1px solid
    outline: none
    padding: 1px
    z-index: 2

  &:focus
    border: #3232ff 2px solid
    outline: none
    padding: 0
    z-index: 2

  &[contenteditable="true"]
    background: rgba(255, 255, 255, 0.67)
</style>
