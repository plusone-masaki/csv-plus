<template lang="pug">
tr.header-row
  th.header-cell
  th.header-cell(
    v-for="header in headers"
  )
    | {{ header }}
</template>

<script lang="ts">
import base26 from 'base26'
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'HeaderRow',
  props: {
    items: { type: Array, default: () => [] },
    length: { type: Number, required: true },
  },
  setup (props) {
    const compute = {
      headers: computed(() => (
        props.items.length
          ? props.items
          : [...Array(props.length)].map((_, i) => base26.to(i + 1).toUpperCase())
      )),
    }

    return {
      ...compute,
    }
  },
})
</script>

<style lang="sass" scoped>
.header-cell
  background: #000
  color: #eee
  width: 48px
</style>
