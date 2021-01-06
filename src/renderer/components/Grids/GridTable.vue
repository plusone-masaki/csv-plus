<template lang="pug">
table.grid-table
  header-row(
    v-model:length="length"
  )
  content-row(
    v-for="(_, index) in data"
    v-model:value="data[index]"
    :index="index"
  )
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import ContentRow from './ContentRow.vue'
import HeaderRow from './HeaderRow.vue'

export default defineComponent({
  name: 'GridTable',
  components: { HeaderRow, ContentRow },
  props: {
    data: { type: Array, required: true },
  },
  setup (props) {
    const compute = {
      length: computed(() => Math.max(...props.data.map((item) => item instanceof Array ? item.length : 0))),
    }

    return {
      ...compute,
    }
  },
})
</script>

<style lang="sass" scoped>
.grid-table
  border-spacing: 1px
</style>
