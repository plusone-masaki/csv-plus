<template lang="pug">
section.content
  grid-table(
    :data="file.data"
    :path="file.path"
    :options="file.options"
    :active="active"
    @load="onLoad"
    @edit="onEdit"
  )
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  Ref,
} from 'vue'
import HandsOnTable from 'handsontable'
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
  setup: (props, context) => ({
    onLoad: (table: Ref<HandsOnTable>) => context.emit('load', table),
    onEdit: () => context.emit('edit'),
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
