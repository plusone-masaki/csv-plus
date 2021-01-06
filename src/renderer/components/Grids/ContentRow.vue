<template lang="pug">
tr.content-row
  th.content-row__header {{ index + 1 }}
  content-cell(
    v-for="i in value.length"
    v-model:value="values[i - 1]"
    :tabindex="index * value.length + i"
    :key="i"
    @move="onMove"
  )
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import ContentCell from './ContentCell.vue'

export default defineComponent({
  name: 'ContentRow',
  components: {
    ContentCell,
  },
  props: {
    index: { type: Number, required: true },
    value: { type: Array, default: () => [] },
  },
  setup (props, { emit }) {
    const compute = {
      values: computed({
        get: () => props.value,
        set: (value: unknown[]) => emit('update:value', value),
      }),
    }

    const methods = {
      onMove: (params: { to: string; tabindex: number }) => {
        let nextIndex = params.tabindex
        switch (params.to) {
          case 'up':
            nextIndex -= props.value.length
            break
          case 'down':
            nextIndex += props.value.length
            break
          case 'left':
            if (params.tabindex % props.value.length !== 1) nextIndex--
            break
          case 'right':
            if (params.tabindex % props.value.length) nextIndex++
            break
        }

        const el = document.querySelector(`.content-cell[tabindex="${nextIndex}"]`) as HTMLTableCellElement|null
        if (el) el.focus()
      },
    }

    return {
      ...compute,
      ...methods,
    }
  },
})
</script>

<style lang="sass" scoped>
.content-row
  height: 1px

  &__header
    background: #000
    color: #eee
    width: 48px
</style>
