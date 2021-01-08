<template lang="pug">
tr.content-row
  th.content-row__header(
    :data-rows="rows"
  )
    | {{ rows }}
  content-cell(
    v-for="i in length"
    v-model="values[i - 1]"
    :tabindex="index * modelValue.length + i"
    :rows="rows"
    :cols="i"
    :key="i"
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
  emits: ['input'],
  props: {
    modelValue: { type: Array, default: () => [] },
    index: { type: Number, required: true },
    length: { type: Number, required: true },
  },
  setup (props, { emit }) {
    const compute = {
      values: computed({
        get: () => props.modelValue,
        set: (value: unknown[]) => emit('input', value),
      }),

      rows: computed(() => props.index + 1),
    }

    return {
      ...compute,
    }
  },
})
</script>

<style lang="sass" scoped>
.content-row
  height: 1px

  &__header
    background: #333
    color: #eee
    user-select: none
    width: 48px
</style>
