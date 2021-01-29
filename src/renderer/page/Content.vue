<template lang="pug">
section.content
  grid-table(
    :data="file.data"
    :path="file.path"
    :options="file.options"
    :active="active"
    @edit="onEdit"
  )
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
} from 'vue'
import { FileData } from '@/renderer/types'
import GridTable from '@/renderer/components/Grids/GridTable.vue'

export default defineComponent({
  name: 'Content',
  components: {
    GridTable,
  },
  props: {
    file: { type: Object as PropType<FileData>, required: true },
    active: { type: Boolean as PropType<boolean>, required: true },
  },
  setup: (props, { emit }) => ({
    onEdit: () => emit('edit'),
  }),
})
</script>

<style lang="sass" scoped>
.content
  box-sizing: border-box
  height: 100%
  overflow: hidden
  width: 100vw
</style>
