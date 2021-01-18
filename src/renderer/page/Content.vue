<template lang="pug">
section.content
  control-panel(v-model="file.setting")

  main.main
    grid-table(
      :data="file.data"
      :path="file.path"
      @edit="onEdit"
    )
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { FileData } from '@/renderer/types'
import ControlPanel from '@/renderer/components/ControlPanel.vue'
import GridTable from '@/renderer/components/Grids/GridTable.vue'

export default defineComponent({
  name: 'Content',
  components: {
    ControlPanel,
    GridTable,
  },
  props: {
    file: { type: Object as PropType<FileData>, required: true },
  },
  setup (props, { emit }) {
    return {
      onEdit: () => emit('edit'),
    }
  },
})
</script>

<style lang="sass" scoped>
.content
  box-sizing: border-box
  display: grid
  grid-template-rows: min-content 1fr
  padding: 16px
  width: 100vw
</style>
