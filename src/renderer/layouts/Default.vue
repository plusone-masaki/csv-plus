<template lang="pug">
.wrapper
  header
  main
    //template(v-for="(values, index) in items")
      BodyRow(v-model:values="values" :index="index")
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import BodyRow from '@/renderer/components/Grids/BodyRow.vue'

export default defineComponent({
  name: 'DefaultLayout',
  components: { BodyRow },
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
