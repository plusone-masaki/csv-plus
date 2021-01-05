<template lang="pug">
.wrapper
  header
  main
    table(style="height:1px;width: 100%;border-spacing: 1px")
      ContentRow(v-for="(_, index) in items" v-model:value="items[index]" :index="index")
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import ContentRow from '@/renderer/components/Grids/ContentRow.vue'

export default defineComponent({
  name: 'DefaultLayout',
  components: { ContentRow },
  setup () {
    const state = reactive({
      items: [
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
