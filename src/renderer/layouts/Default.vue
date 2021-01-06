<template lang="pug">
.wrapper
  header
  main
    grid-table(:data="data")
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import ContentRow from '@/renderer/components/Grids/ContentRow.vue'
import GridTable from '@/renderer/components/Grids/GridTable.vue'

export default defineComponent({
  name: 'DefaultLayout',
  components: { GridTable, ContentRow },
  setup () {
    const state = reactive({
      data: [
        [1, 2, 3, 4],
        [2, 2, 3, 4],
        [3, 2, 3, 4],
        [4, 2, 3, 4],
      ],
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="sass" scoped>
.wrapper
  display: grid
  grid-auto-flow: column dense
  grid-template-rows: 100px 1fr
  min-height: 100vh
</style>
