<template lang="pug">
.wrapper
  header {{ state.data }}
  main
    grid-table(v-model="state.data")
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import GridTable from '@/renderer/components/GridTable.vue'

export default defineComponent({
  name: 'DefaultLayout',
  components: { GridTable },
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
      state,
    }
  },
})
</script>

<style lang="sass" scoped>
.wrapper
  box-sizing: border-box
  display: grid
  grid-auto-flow: column dense
  grid-template-rows: 100px 1fr
  min-height: 100vh
  padding: 16px
</style>
