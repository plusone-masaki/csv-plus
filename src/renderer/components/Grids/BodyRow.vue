<template lang="pug">
tr.body-row
  th.body-row__header {{ index }}
  BodyCell(v-for="value in _values" v-model="value")
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import BodyCell from '@/renderer/components/Grids/BodyCell.vue'

type Props = {
  index: number;
  values: any[];
}

export default defineComponent({
  name: 'BodyRow',
  components: {
    BodyCell,
  },
  props: {
    index: { type: Number, required: true },
    values: { type: Array, default: () => [] },
  },
  setup (props: Props, context) {
    const _values = computed(() => ({
      get: () => props.values,
      set: (values: any[]) => context.emit('update:values', values),
    }))

    return {
      _values,
    }
  },
})
</script>

<style lang="sass" scoped>
.body-row
  &__header
    background: #000
</style>
