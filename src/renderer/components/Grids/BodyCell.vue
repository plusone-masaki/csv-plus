<template lang="pug">
td.cell(contenteditable="true")
  | {{ _value }}
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

type Props = {
  value: string|number;
}

export default defineComponent({
  name: 'BodyCell',
  props: {
    value: { type: [String, Number], required: true },
  },
  setup (props: Props, context) {
    const _value = computed(() => ({
      get: () => props.value,
      set: (value: string|number) => context.emit('input', value),
    }))

    return {
      _value,
    }
  },
})
</script>

<style lang="sass" scoped>
</style>
